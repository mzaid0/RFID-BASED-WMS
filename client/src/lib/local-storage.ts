import CryptoJS from "crypto-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setLocalStorage = (name: string, value: any) => {
  value = CryptoJS.AES.encrypt(
    `${JSON.stringify(value)}`,
    process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string
  ).toString();
  localStorage.setItem(name, JSON.stringify(value));
};

export const getLocalStorage = (name: string) => {
  const local = localStorage?.getItem(name) as string;

  if (!local) {
    return null;
  }
  const data = JSON.parse(local);
  if (data) {
    const decrypted = CryptoJS.AES.decrypt(
      data,
      process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string
    );

    try {
      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      if (error) return null;
    }
  } else return null;
};

export const DeleteLocalStorage = (name: string) => {
  localStorage.removeItem(name);
};
