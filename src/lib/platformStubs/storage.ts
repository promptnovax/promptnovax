export const ref = (...args: any[]) => ({
  __storageStub: true,
  args
})

export const uploadBytes = async () => ({
  metadata: {},
  ref: {
    fullPath: ''
  }
})

export const getDownloadURL = async () => ''

