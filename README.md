### **Workflow**
Utilizamos Github Flow:
https://docs.github.com/en/get-started/using-github/github-flow

### **Deploy**
Para instalar el backend, se deberá ejecutar:
```
git clone https://github.com/ddsw-mn/2025-2c-backend-grupo-03.git
cd 2025-2c-backend-grupo-03/packages/backend
npm install
```

Opcionalmente, se instalan las herramientas de testing con:
```
npm install --save-dev jest @babel/core @babel/preset-env babel-jest
```

Luego, se puede correr en el ambiente de desarrollo así: 
```
npm run start:development 
```

Y en el ambiente de producción así:
```
npm run start:prod 
```

### **Decisiones**
1. Los objetos de dominio se crean en los mappers, y estos son llamados por los controllers.
2. Los pedidos tienen que contener productos de un mismo vendedor.
3. En caso de no haber stock, no se puede crear el pedido. (Se controla en el service).
4. El stock se reduce una vez creado el pedido.
5. Los ids deben ser pasados como strings.
6. Temporalmente, el usuarioID se envia en el body.
7. Los estados son constantes, instancias de una clase EstadoPedido.
8. Los cambios de estados estan unificados en un solo endpoint para que la api sea restful.
9. Un errorHandler por route.


### **Integrantes**
- Agustín Carlana Rivero
- Alejo Scarlato
- Tomás Sagrada
- Tobías Waizer
