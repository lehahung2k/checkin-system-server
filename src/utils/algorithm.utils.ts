import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 6;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPass: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPass);
};

export const generateTenantCode = () => {
  return '';
};
