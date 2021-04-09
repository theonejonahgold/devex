type responseType = 'data' | 'confirmed' | 'error'

interface RestResponse<T extends responseType> {
  type: T
}

interface ConfirmationResponse extends RestResponse<'confirmed'> {}

interface DataResponse extends RestResponse<'data'> {
  data: any
}

interface ErrorResponse extends RestResponse<'error'> {
  error: string
}
