import slugify from 'slugify';

const slugOptions = {
  lower: true,
  strict: true,
};

export function generateSlug(str: string): string {
  return slugify(str, slugOptions);
}

