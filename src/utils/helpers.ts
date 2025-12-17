
export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  // If it's already a formatted string like "2023-10-15", return it.
  // If it's a Firestore timestamp (which usually comes as seconds in some contexts, but here we expect the stored 'date' field to be a string based on your schema),
  // we'll assume the simple string format for now as per your schema description.
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};
