CREATE TABLE "pedido_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"pedido_id" integer NOT NULL,
	"nombre_producto" text NOT NULL,
	"precio" numeric(10, 2) NOT NULL,
	"cantidad" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pedidos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"email" text NOT NULL,
	"telefono" text,
	"direccion" text NOT NULL,
	"apartamento" text,
	"ciudad" text NOT NULL,
	"estado" text NOT NULL,
	"codigo_postal" text NOT NULL,
	"metodo_pago" text NOT NULL,
	"metodo_envio" text NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"costo_envio" numeric(10, 2) NOT NULL,
	"impuesto" numeric(10, 2) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "pedido_items" ADD CONSTRAINT "pedido_items_pedido_id_pedidos_id_fk" FOREIGN KEY ("pedido_id") REFERENCES "public"."pedidos"("id") ON DELETE no action ON UPDATE no action;