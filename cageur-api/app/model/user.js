const ROLES = ['superadmin', 'clinic'];

class User {
  constructor(db, args) {
    this.email = args.email || '';
    this.name = args.name || '';
    this.password = args.password || '';
    this.role = args.password || '';
  }

  isValidEmail() {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.email);
  }

  isValidRole() {
    return ROLES.indexOf(this.role) > -1;
  }

  isValidPassword() {
    const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return re.test(this.password);
  }
}
