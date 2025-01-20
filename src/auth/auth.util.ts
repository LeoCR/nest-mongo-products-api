import * as bcrypt from 'bcrypt';

export const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  const hash = bcrypt.hash(password, salt);
  return hash;
};

export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
