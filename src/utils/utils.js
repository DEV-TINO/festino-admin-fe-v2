export const isUUID = (uuid) => {
  const uuidRegex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$');
  return uuidRegex.test(uuid);
};

export const setBackgroundImage = (url) => {
  return {
    backgroundImage: `url(${url})`,
  };
};
