export class adminlogin {
  userId: string = '';
  username: string = '';
  password: string = '';
  role: string = ''
}

export class changePswModel {
  email: string = '';
  otp: string = '';
  newPassword: string = '';
}

export class registerModel {
  username: string = ''
  password: string = ''
  email: string = ''
  fullName: string = ''
  phone: any
  role: string = 'Admin'
}
