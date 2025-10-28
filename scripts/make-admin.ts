import { drizzle } from "drizzle-orm/mysql2";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const email = "felipefaria2019cps@gmail.com";

async function makeAdmin() {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL não configurada!");
    process.exit(1);
  }

  const db = drizzle(DATABASE_URL);

  try {
    // Buscar usuário
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user.length) {
      console.error(`❌ Usuário com email ${email} não encontrado!`);
      process.exit(1);
    }

    console.log(`✅ Usuário encontrado: ${user[0].name} (ID: ${user[0].id})`);
    console.log(`   Role atual: ${user[0].role}`);

    // Atualizar para admin
    await db
      .update(users)
      .set({ role: "admin" })
      .where(eq(users.email, email));

    console.log(`✅ Usuário ${email} agora é ADMIN!`);
    
    // Verificar
    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    console.log(`   Nova role: ${updatedUser[0].role}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  }
}

makeAdmin();

