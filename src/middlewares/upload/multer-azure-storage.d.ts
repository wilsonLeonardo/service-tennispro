declare module 'multer-azure-storage' {
  interface Options {
    azureStorageConnectionString: string;
    containerName: string;
    containerSecurity: 'blob';
  }

  type Instance = new (o: Options) => any;

  const ins: Instance;

  export default ins;
}
