export const getProviderColor = (provider: string) => {
  switch (provider) {
    case "AWS":
      return "#facc15"; // yellow-400
    case "GCP":
      return "#22c55e"; // green-500
    case "Azure":
      return "#3b82f6"; // blue-500
    case "Exchange":
      return "#ef4444"; // red-500
    default:
      return "#9ca3af"; // gray-400
  }
};
