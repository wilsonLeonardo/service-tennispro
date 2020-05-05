export const successMessage = (data: {}, object?: {}, statusCode?: number) => {
  return {
    statusCode: statusCode || 200,
    success: true,
    errorMessage: undefined,
    requestTime: new Date(),
    data,
    object,
  };
};

export const failMessage = (
  statusCode: number,
  errorMessage: string,
  stack?: Error
) => {
  return Object.assign(
    {},
    {
      statusCode,
      data: undefined,
      success: false,
      errorMessage,
      requestTime: new Date(),
    },
    process.env.NODE_ENV === 'development' ? { stack } : {}
  );
};
