export { errorBody, confirmBody, dataBody }

function errorBody(error: string) {
  return {
    type: 'error',
    error,
  } as ErrorResponse
}

function confirmBody() {
  return { type: 'confirmed' } as ConfirmationResponse
}

function dataBody(data: Record<string, any>) {
  return {
    type: 'data',
    data,
  } as DataResponse
}
