export function slugify(str: string): string {
  let res = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
  res = res.toLowerCase(); // convert string to lowercase

  res = res
    .replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens

  return res;
}
