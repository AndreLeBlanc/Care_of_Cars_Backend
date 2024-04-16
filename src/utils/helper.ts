export const isDataUpdated = (value: Object | undefined): object => {
  return { updated: value ? true : false }
}
