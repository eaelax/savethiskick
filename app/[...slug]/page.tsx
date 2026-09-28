import { redirect } from 'next/navigation';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const kickPath = Array.isArray(slug) ? slug.join('/') : (slug || '');
  let fullKickUrl = `https://kick.com/${kickPath}`;

  const resolvedSearch = searchParams ? await searchParams : undefined;
  if (resolvedSearch?.clip) {
    const clipVal = Array.isArray(resolvedSearch.clip) ? resolvedSearch.clip[0] : resolvedSearch.clip;
    fullKickUrl += (fullKickUrl.includes('?') ? '&' : '?') + `clip=${clipVal}`;
  }

  redirect(`/?url=${encodeURIComponent(fullKickUrl)}`);
}
