export function getContentType(feedType: 'rss2' | 'atom1' | 'json1') {
  const mimeTypeMap = {
    rss2: 'application/rss+xml',
    atom1: 'application/atom+xml',
    json1: 'application/json'
  };
  const mime = mimeTypeMap[feedType];

  return `${mime}; charset=UTF-8`;
}
