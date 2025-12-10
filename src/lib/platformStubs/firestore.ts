type FirestoreRef = {
  __firestoreStub: true
  args: any[]
}

const createRef = (...args: any[]): FirestoreRef => ({
  __firestoreStub: true,
  args
})

const createDocSnapshot = () => ({
  id: '',
  exists: () => false,
  data: () => ({}),
})

export const collection = (...args: any[]) => createRef(...args)
export const doc = (...args: any[]) => createRef(...args)
export const query = (...args: any[]) => createRef(...args)
export const where = (...args: any[]) => createRef(...args)
export const orderBy = (...args: any[]) => createRef(...args)
export const limit = (...args: any[]) => createRef(...args)
export const startAfter = (...args: any[]) => createRef(...args)

export const arrayUnion = (...values: any[]) => values
export const arrayRemove = (...values: any[]) => values

export const serverTimestamp = () => new Date()

export const getDoc = async () => createDocSnapshot()
export const getDocs = async () => ({
  docs: [],
  empty: true,
  forEach: () => {}
})

export const setDoc = async () => {}
export const updateDoc = async () => {}
export const addDoc = async () => ({ id: `stub-${Date.now()}` })
export const deleteDoc = async () => {}

export const onSnapshot = (_query: any, callback: any) => {
  if (typeof callback === 'function') {
    callback({ docs: [] })
  }
  return () => {}
}

export const runTransaction = async (_db: any, updater: any) => {
  if (typeof updater === 'function') {
    return updater({
      get: async () => createDocSnapshot(),
      set: () => {},
      update: () => {},
      delete: () => {}
    })
  }
}

export const increment = (value: number) => value
export const decrement = (value: number) => -value

export const writeBatch = () => ({
  set: () => {},
  update: () => {},
  delete: () => {},
  commit: async () => {}
})

