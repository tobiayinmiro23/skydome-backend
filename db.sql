create table users(
    id serial,
    name text,
    email text unique,
    password text,
    joined text
)
create table usercheckout(
    id serial,
    productname text,
    pproductprice text,
    productquantity text,
    orderdate text,
    paymentstatus text,
    email text,
    phonenumber text,
    buyersname text,
    address text
)