import { db } from '../db';
import { users, subscriptions, referrals } from '../../drizzle/schema';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

/**
 * Script para inicializar dados de trial e referral para usuários existentes
 */
async function initializeExistingUsers() {
  console.log('🔄 Inicializando dados para usuários existentes...');

  try {
    // Buscar todos os usuários
    const allUsers = await db.select().from(users);
    console.log(`📊 Encontrados ${allUsers.length} usuários`);

    for (const user of allUsers) {
      // 1. Verificar se já tem subscription
      const existingSub = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, user.id))
        .limit(1);

      if (existingSub.length === 0) {
        // Criar subscription de trial (7 dias)
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7);

        await db.insert(subscriptions).values({
          userId: user.id,
          status: 'trial',
          trialEndsAt: trialEndDate,
          currentPeriodEnd: trialEndDate,
        });

        console.log(`✅ Trial criado para usuário ${user.id}`);
      }

      // 2. Verificar se já tem código de referral
      const existingReferral = await db
        .select()
        .from(referrals)
        .where(eq(referrals.userId, user.id))
        .limit(1);

      if (existingReferral.length === 0) {
        // Criar código de referral único
        const referralCode = nanoid(10);

        await db.insert(referrals).values({
          userId: user.id,
          code: referralCode,
          totalReferrals: 0,
          bonusDays: 0,
        });

        console.log(`✅ Código de referral criado para usuário ${user.id}: ${referralCode}`);
      }
    }

    console.log('🎉 Inicialização concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar:', error);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  initializeExistingUsers()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { initializeExistingUsers };

