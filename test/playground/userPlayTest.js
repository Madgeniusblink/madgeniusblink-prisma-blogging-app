import {getFirstName, isValidPassword} from "../src/utils/user"

test('should return first name when given full name', () => {
    const firstName = getFirstName('Cristian Romero')
    expect(firstName).toBe('Cristian');
});

test('should return first name when given full name', () => {
    const firstName = getFirstName('jen')
    expect(firstName).toBe('jen');
});

test('should reject password less than 8 character', () => {
    const isValid = isValidPassword('werhgfb')
    expect(isValid).toBe(false);
});

test('should reject password that contains word password', () => {
    const isValid = isValidPassword('passwordnewton')
    expect(isValid).toBe(false);
});

test('Should correctly validate a valid password', () => {
    const isValid = isValidPassword('supernewAwe@#$')
    expect(isValid).toBe(true);
});