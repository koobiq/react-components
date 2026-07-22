import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  Username,
  UsernamePrimary,
  buildUsernameText,
  formatUsername,
  formatUsernameCustom,
  usernamePropMode,
  usernamePropType,
} from './index.js';

const fullProfile = {
  firstName: 'Maxwell',
  middleName: 'Alan',
  lastName: 'Root',
  login: 'mroot',
  site: 'corp',
};

describe('Username', () => {
  const baseProps = { 'data-testid': 'username' };
  const getRoot = () => screen.getByTestId<HTMLSpanElement>('username');

  it('should forward a ref to the root span element', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(<Username ref={ref} />);
    expect(ref.current).toBe(container.firstElementChild);
  });

  it('should merge a custom className with component classes', () => {
    render(<Username {...baseProps} className="custom" />);
    expect(getRoot()).toHaveClass('custom');
  });

  it('should spread additional HTML props onto the root element', () => {
    render(<Username {...baseProps} aria-label="User" />);
    expect(getRoot()).toHaveAttribute('aria-label', 'User');
  });

  describe('default data attributes', () => {
    it('should set data-mode to "inline" by default', () => {
      render(<Username {...baseProps} />);
      expect(getRoot()).toHaveAttribute('data-mode', 'inline');
    });

    it('should set data-type to "default" by default', () => {
      render(<Username {...baseProps} />);
      expect(getRoot()).toHaveAttribute('data-type', 'default');
    });

    it('should not set data-compact by default', () => {
      render(<Username {...baseProps} />);
      expect(getRoot()).not.toHaveAttribute('data-compact');
    });
  });

  describe('prop reflection', () => {
    it.each(usernamePropMode)('should set data-mode to "%s"', (mode) => {
      render(<Username {...baseProps} mode={mode} />);
      expect(getRoot()).toHaveAttribute('data-mode', mode);
    });

    it.each(usernamePropType)('should set data-type to "%s"', (type) => {
      render(<Username {...baseProps} type={type} />);
      expect(getRoot()).toHaveAttribute('data-type', type);
    });

    it('should set data-compact when isCompact is true', () => {
      render(<Username {...baseProps} isCompact userInfo={fullProfile} />);
      expect(getRoot()).toHaveAttribute('data-compact');
    });
  });

  describe('default template rendering (non-compact)', () => {
    it('should render the formatted full name in Primary when firstName and lastName are present', () => {
      render(<Username userInfo={fullProfile} />);
      expect(screen.getByText('Root M. A.')).toBeInTheDocument();
    });

    it('should apply the fullNameFormat prop to the rendered name', () => {
      render(<Username userInfo={fullProfile} fullNameFormat="lf." />);
      expect(screen.getByText('Root M.')).toBeInTheDocument();
    });

    it('should render login in Secondary when login is provided', () => {
      render(<Username userInfo={fullProfile} />);
      const secondary = document.querySelector('[class*="secondary"]');
      expect(secondary?.textContent).toContain('mroot');
    });

    it('should render site as SecondaryHint inside Secondary when site is provided', () => {
      render(<Username userInfo={fullProfile} />);
      expect(screen.getByText('(corp)', { exact: false })).toBeInTheDocument();
    });

    it('should not render Primary when firstName is missing', () => {
      render(<Username userInfo={{ lastName: 'Root', login: 'mroot' }} />);
      const primary = document.querySelector('[class*="primary"]');
      expect(primary).toBeNull();
    });

    it('should not render Primary when lastName is missing', () => {
      render(<Username userInfo={{ firstName: 'Maxwell', login: 'mroot' }} />);
      const primary = document.querySelector('[class*="primary"]');
      expect(primary).toBeNull();
    });

    it('should render login as primary content when full name is absent', () => {
      render(<Username userInfo={{ login: 'mroot' }} />);
      expect(screen.getByText('mroot')).toBeInTheDocument();
    });
  });

  describe('compact mode', () => {
    it('should render a single Primary containing the formatted name', () => {
      render(<Username userInfo={fullProfile} isCompact />);
      const primary = document.querySelector('[class*="primary"]');
      expect(primary?.textContent).toContain('Root M. A.');
    });

    it('should render login inside Primary in compact mode when full name is absent', () => {
      render(<Username userInfo={{ login: 'mroot' }} isCompact />);
      const primary = document.querySelector('[class*="primary"]');
      expect(primary?.textContent).toContain('mroot');
    });

    it('should render site as SecondaryHint inside Primary in compact mode', () => {
      render(<Username userInfo={fullProfile} isCompact />);
      const primary = document.querySelector('[class*="primary"]');
      expect(primary?.textContent).toContain('(corp)');
    });
  });

  describe('formatter prop', () => {
    it('should use the provided formatter instead of formatUsername', () => {
      const customFormatter = vi.fn().mockReturnValue('Custom Name');
      render(<Username userInfo={fullProfile} />);
      render(<Username userInfo={fullProfile} formatter={customFormatter} />);
      expect(customFormatter).toHaveBeenCalledWith(fullProfile, 'lf.m.');
      expect(screen.getByText('Custom Name')).toBeInTheDocument();
    });

    it('should pass fullNameFormat to the formatter', () => {
      render(
        <Username
          userInfo={fullProfile}
          formatter={formatUsernameCustom}
          fullNameFormat="F L"
        />
      );

      expect(screen.getByText('Maxwell Root')).toBeInTheDocument();
    });
  });

  describe('custom view (children)', () => {
    it('should render children instead of the default template', () => {
      render(
        <Username {...baseProps}>
          <UsernamePrimary>Custom Name</UsernamePrimary>
        </Username>
      );

      expect(screen.getByText('Custom Name')).toBeInTheDocument();
    });

    it('should not render auto-generated content when children are provided', () => {
      render(
        <Username {...baseProps} userInfo={fullProfile}>
          <UsernamePrimary>Custom</UsernamePrimary>
        </Username>
      );

      expect(screen.queryByText('Root M. A.')).toBeNull();
      expect(screen.queryByText('mroot')).toBeNull();
    });

    it('should still apply data attributes to the root span in custom view', () => {
      render(
        <Username {...baseProps} mode="stacked" type="error">
          <UsernamePrimary>Custom</UsernamePrimary>
        </Username>
      );

      expect(getRoot()).toHaveAttribute('data-mode', 'stacked');
      expect(getRoot()).toHaveAttribute('data-type', 'error');
    });
  });
});

describe('formatUsername', () => {
  it('should return an empty string when userInfo is undefined', () => {
    expect(formatUsername(undefined)).toBe('');
  });

  it('should format "lf.m." correctly with all three name parts present', () => {
    expect(
      formatUsername(
        { firstName: 'Maxwell', middleName: 'Alan', lastName: 'Root' },
        'lf.m.'
      )
    ).toBe('Root M. A.');
  });

  it('should skip empty fields without leaving stray dots', () => {
    expect(
      formatUsername({ firstName: 'Maxwell', lastName: 'Root' }, 'lf.m.')
    ).toBe('Root M.');
  });

  it('should emit the full field value when the next character is not a dot', () => {
    expect(
      formatUsername({ firstName: 'Maxwell', lastName: 'Root' }, 'lf')
    ).toBe('Root Maxwell');
  });

  it('should handle a custom format string', () => {
    expect(
      formatUsername({ firstName: 'Maxwell', lastName: 'Root' }, 'fl.')
    ).toBe('Maxwell R.');
  });
});

describe('formatUsernameCustom', () => {
  it('should return an empty string when userInfo is undefined', () => {
    expect(formatUsernameCustom(undefined)).toBe('');
  });

  it('should format "L f. m." correctly with all three name parts present', () => {
    expect(
      formatUsernameCustom(
        { firstName: 'Maxwell', middleName: 'Alan', lastName: 'Root' },
        'L f. m.'
      )
    ).toBe('Root M. A.');
  });

  it('should emit the full value for uppercase keys', () => {
    expect(
      formatUsernameCustom({ firstName: 'Maxwell', lastName: 'Root' }, 'F L')
    ).toBe('Maxwell Root');
  });

  it('should emit only the initial for lowercase keys', () => {
    expect(
      formatUsernameCustom({ firstName: 'Maxwell', lastName: 'Root' }, 'f l')
    ).toBe('M R');
  });

  it('should emit non-field characters literally', () => {
    expect(
      formatUsernameCustom({ firstName: 'Maxwell', lastName: 'Root' }, 'L, F')
    ).toBe('Root, Maxwell');
  });

  it('should silently drop an empty field key while preserving surrounding literals', () => {
    expect(
      formatUsernameCustom(
        { firstName: 'Maxwell', lastName: 'Root' },
        'L f. m.'
      )
    ).toBe('Root M. .');
  });

  it('should accept a custom mapping', () => {
    expect(
      formatUsernameCustom({ firstName: 'Maxwell', lastName: 'Root' }, 'A', {
        A: 'firstName',
      })
    ).toBe('Maxwell');
  });
});

describe('buildUsernameText', () => {
  it('should return only the name when login and site are absent', () => {
    expect(buildUsernameText({ name: 'Root M. A.' })).toBe('Root M. A.');
  });

  it('should append login after the name', () => {
    expect(buildUsernameText({ name: 'Root M. A.', login: 'mroot' })).toBe(
      'Root M. A. mroot'
    );
  });

  it('should wrap site in parentheses by default', () => {
    expect(
      buildUsernameText({ name: 'Root M. A.', login: 'mroot', site: 'corp' })
    ).toBe('Root M. A. mroot (corp)');
  });

  it('should apply a custom formatSite', () => {
    expect(
      buildUsernameText(
        { name: 'Root M. A.', login: 'mroot', site: 'corp' },
        { formatSite: (s) => s }
      )
    ).toBe('Root M. A. mroot corp');
  });

  it('should apply a custom formatLogin', () => {
    expect(
      buildUsernameText(
        { name: 'Root M. A.', login: 'mroot', site: 'corp' },
        { formatLogin: (l) => `[${l}]` }
      )
    ).toBe('Root M. A. [mroot] (corp)');
  });

  it('should omit login segment when login is absent', () => {
    expect(buildUsernameText({ name: 'Root M. A.', site: 'corp' })).toBe(
      'Root M. A. (corp)'
    );
  });

  it('should omit site segment when site is absent', () => {
    expect(buildUsernameText({ name: 'Root M. A.', login: 'mroot' })).toBe(
      'Root M. A. mroot'
    );
  });
});
