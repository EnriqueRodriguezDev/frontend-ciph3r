// Tipo base común
export type BaseEntity = {
    id?: number; 
    name: string;
  };
  
  export type Token = {
    value: string;
  };
  
  export type CategoriesSummary = BaseEntity; //id y name ya están definidos en BaseEntity
  
  //Extendiendo BaseEntity y agregando propiedades específicas
  export type UserData = {
    success: boolean;
    token: string;
    email: string;
  } & BaseEntity; // Combina con BaseEntity (hereda name)
  
  //Registro hereda email y name, pero define propiedades específicas
  export type Register = Pick<UserData, 'name' | 'email'> & {
    password: string;
    c_password: string;
  };

  //Se toman las propiedades email y password
  export type Login = Pick<UserData, 'email'> & Pick<Register, 'password'>;

  export type CategoriesSummmary = BaseEntity;
  
  //Producto extiende BaseEntity y agrega propiedades específicas
  export type ProductSummary = BaseEntity & {
    price: number;
    description: string;
    categories: CategoriesSummary;
  };  