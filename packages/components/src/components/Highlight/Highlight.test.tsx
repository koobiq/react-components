import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Highlight, highlightPropVariant } from './index';

describe('Highlight', () => {
  const baseProps = { 'data-testid': 'highlight' };

  const getRoot = () => screen.getByTestId('highlight');

  const getMarks = () => Array.from(getRoot().querySelectorAll('mark'));

  const getMarkTexts = () => getMarks().map((mark) => mark.textContent);

  it('should forward a ref to the root element', () => {
    const ref = createRef<HTMLSpanElement>();

    render(<Highlight {...baseProps} ref={ref} />);

    expect(ref.current).toBe(getRoot());
  });

  it('should merge a custom class name with the default ones', () => {
    render(<Highlight {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });

  it('should spread additional HTML props onto the root element', () => {
    render(<Highlight {...baseProps} aria-label="Match" />);

    expect(getRoot()).toHaveAttribute('aria-label', 'Match');
  });

  it('should render the component as a custom root tag', () => {
    render(<Highlight {...baseProps} as="div" text="Cube" />);

    expect(getRoot().tagName).toBe('DIV');
  });

  it('should set data-variant to "background" by default', () => {
    render(<Highlight {...baseProps} />);

    expect(getRoot()).toHaveAttribute('data-variant', 'background');
  });

  describe('check the variant prop', () => {
    it.each(highlightPropVariant)(
      'should apply the variant as a "%s"',
      (variant) => {
        render(<Highlight {...baseProps} variant={variant} />);

        expect(getRoot()).toHaveAttribute('data-variant', variant);
      }
    );
  });

  describe('without highlighting', () => {
    it('should render the text as is when the query is undefined', () => {
      render(<Highlight {...baseProps} text="Hello world" />);

      expect(getRoot()).toHaveTextContent('Hello world');
      expect(getMarks()).toHaveLength(0);
    });

    it('should render the text as is when the query is empty', () => {
      render(<Highlight {...baseProps} text="Hello world" query="" />);

      expect(getRoot()).toHaveTextContent('Hello world');
      expect(getMarks()).toHaveLength(0);
    });

    it('should render the text as is when the query is not found', () => {
      render(<Highlight {...baseProps} text="Hello world" query="xyz" />);

      expect(getRoot()).toHaveTextContent('Hello world');
      expect(getMarks()).toHaveLength(0);
    });

    it('should render nothing when the text is undefined', () => {
      render(<Highlight {...baseProps} query="a" />);

      expect(getRoot()).toBeEmptyDOMElement();
    });
  });

  describe('matching', () => {
    it('should wrap the match in a mark element', () => {
      render(<Highlight {...baseProps} text="Hello world" query="world" />);

      expect(getMarkTexts()).toEqual(['world']);
      expect(getRoot().textContent).toBe('Hello world');
    });

    it('should highlight all occurrences', () => {
      render(<Highlight {...baseProps} text="ab ab ab" query="ab" />);

      expect(getMarkTexts()).toEqual(['ab', 'ab', 'ab']);
    });

    it('should highlight adjacent repeated matches', () => {
      render(<Highlight {...baseProps} text="aaa" query="a" />);

      expect(getMarkTexts()).toEqual(['a', 'a', 'a']);
    });

    it('should highlight a substring inside a word', () => {
      render(<Highlight {...baseProps} text="Hello" query="ell" />);

      expect(getMarkTexts()).toEqual(['ell']);
    });

    it('should highlight a match at the start of the text', () => {
      render(<Highlight {...baseProps} text="Hello" query="He" />);

      expect(getMarkTexts()).toEqual(['He']);
      expect(getRoot().textContent).toBe('Hello');
    });

    it('should highlight a match at the end of the text', () => {
      render(<Highlight {...baseProps} text="Hello" query="lo" />);

      expect(getMarkTexts()).toEqual(['lo']);
      expect(getRoot().textContent).toBe('Hello');
    });

    it('should highlight the whole text when it fully matches', () => {
      render(<Highlight {...baseProps} text="test" query="test" />);

      expect(getMarkTexts()).toEqual(['test']);
    });

    it('should preserve the whitespace surrounding a match', () => {
      render(<Highlight {...baseProps} text="  a  " query="a" />);

      expect(getRoot().textContent).toBe('  a  ');
      expect(getMarkTexts()).toEqual(['a']);
    });
  });

  describe('case-insensitive matching', () => {
    it('should be case insensitive for latin text', () => {
      render(<Highlight {...baseProps} text="Hello World" query="world" />);

      expect(getMarkTexts()).toEqual(['World']);
    });

    it('should be case insensitive for cyrillic text', () => {
      render(<Highlight {...baseProps} text="Привет" query="привет" />);

      expect(getMarkTexts()).toEqual(['Привет']);
    });

    it('should highlight a cyrillic substring', () => {
      render(<Highlight {...baseProps} text="Привет мир" query="вет" />);

      expect(getMarkTexts()).toEqual(['вет']);
      expect(getRoot().textContent).toBe('Привет мир');
    });
  });

  describe('regular expression special characters in the query', () => {
    it.each([
      ['price is $100', '$100', '$100'],
      ['call()', 'call()', 'call()'],
      ['file.ts', '.', '.'],
      ['arr[0]', '[0]', '[0]'],
    ])(
      'should treat the query "%s" literally',
      (text, query, expectedMatch) => {
        render(<Highlight {...baseProps} text={text} query={query} />);

        expect(getMarkTexts()).toEqual([expectedMatch]);
        expect(getRoot().textContent).toBe(text);
      }
    );
  });

  it('should render HTML in the text as plain characters', () => {
    render(<Highlight {...baseProps} text="<b>bold</b>" query="bold" />);

    expect(getRoot().textContent).toBe('<b>bold</b>');
    expect(getRoot().querySelector('b')).toBeNull();
    expect(getMarkTexts()).toEqual(['bold']);
  });
});
