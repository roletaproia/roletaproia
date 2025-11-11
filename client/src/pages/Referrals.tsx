import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Copy, Check, Gift, Users, Calendar } from "lucide-react";

export default function Referrals() {
  const [copied, setCopied] = useState(false);

  const { data: referralData } = trpc.referral.getMyReferralCode.useQuery();
  const { data: referralsStats } = trpc.referral.getMyReferrals.useQuery();

  const handleCopyLink = () => {
    if (referralData?.link) {
      navigator.clipboard.writeText(referralData.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white p-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-2 text-yellow-400">Sistema de Indicação</h1>
          <p className="text-gray-300">Indique amigos e ajude a expandir nossa comunidade!</p>
        </div>

        {/* Referral Link Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-gradient-to-br from-green-900/20 to-transparent border-green-700/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Gift className="h-6 w-6 text-green-400" />
                <CardTitle className="text-white">Seu Link de Indicação</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Compartilhe este link com seus amigos e ajude-os a descobrir o RoboRoleta!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={referralData?.link || "Carregando..."}
                  readOnly
                  className="bg-slate-900/50 border-green-700/30 text-white"
                />
                <Button
                  onClick={handleCopyLink}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-green-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-gray-300">Total de Indicações</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{referralsStats?.totalReferrals || 0}</p>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 border border-green-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-gray-300">Dias Bônus Ganhos</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{referralsStats?.totalBonusDays || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referrals List */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
            <CardHeader>
              <CardTitle className="text-white">Seus Indicados</CardTitle>
              <CardDescription className="text-gray-300">
                Lista de pessoas que se cadastraram usando seu link
              </CardDescription>
            </CardHeader>
            <CardContent>
              {referralsStats?.referrals && referralsStats.referrals.length > 0 ? (
                <div className="space-y-3">
                  {referralsStats.referrals.map((referral) => (
                    <div
                      key={referral.id}
                      className="bg-slate-900/50 rounded-lg p-4 border border-red-700/30 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-white">{referral.referredName}</p>
                        <p className="text-sm text-gray-400">{referral.referredEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">+{referral.bonusDaysGranted} dias</p>
                        <p className="text-xs text-gray-500">
                          {new Date(referral.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Você ainda não tem indicações.</p>
                  <p className="text-sm mt-1">Compartilhe seu link para começar a ganhar dias grátis!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card className="bg-gradient-to-br from-blue-900/20 to-transparent border-blue-700/30">
            <CardHeader>
              <CardTitle className="text-white">Como Funciona?</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span>Copie seu link de indicação único</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span>Compartilhe com seus amigos nas redes sociais, WhatsApp, etc.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span>Quando alguém se cadastrar usando seu link, você estará ajudando a expandir nossa comunidade!</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <span>Sem limite! Quanto mais indicar, mais dias grátis você ganha!</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

