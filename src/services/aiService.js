// This will be replaced with your actual backend integration
export const sendMessage = async (text) => {
  // Placeholder for API call to your backend
  console.log("Sending to AI service:", text);

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // This is where you'll make the actual API call to your backend
  // For now, we're just returning a placeholder response
  return `This is a placeholder response for: "${text}". Replace this with your actual AI integration.`;
};
