import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap, Crown, Star, MessageCircle } from "lucide-react";

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "monthly",
      name: "Mensal",
      price: "79,90",
      period: "mês",
      description: "Ideal para testar o sistema",
      features: [
        "Acesso completo ao robô",
        "4 estratégias profissionais",
        "Chat em tempo real",
        "Suporte via Telegram",
        "Atualizações automáticas",
      ],
      badge: null,
      savings: null,
    },
    {
      id: "quarterly",
      name: "Trimestral",
      price: "149,90",
      period: "3 meses",
      description: "Melhor custo-benefício",
      features: [
        "Acesso completo ao robô",
        "4 estratégias profissionais",
        "Chat em tempo real",
        "Suporte prioritário",
        "Atualizações automáticas",
        "Sistema de indicação",
      ],
      badge: "Mais Popular",
      savings: "Economize 37%",
    },
    {
      id: "annual",
      name: "Anual",
      price: "359,00",
      period: "12 meses",
      description: "Máximo desconto",
      features: [
        "Acesso completo ao robô",
        "4 estratégias profissionais",
        "Chat em tempo real",
        "Suporte VIP prioritário",
        "Atualizações automáticas",
        "Sistema de indicação",
        "Novas funcionalidades em primeira mão",
      ],
      badge: "Melhor Valor",
      savings: "Economize 62%",
    },
  ];

  const handleContactSupport = () => {
    window.open("https://t.me/roletaproia", "_blank");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white p-6">
        {/* Header */}
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            Escolha Seu Plano
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Invista no seu sucesso com o Roleta Pro I.A.
          </p>
          
          {/* Trial Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-900/30 to-green-900/30 border border-green-500/50 rounded-full px-6 py-3">
            <Zap className="h-5 w-5 text-green-400" />
            <span className="font-bold text-green-300">Experimente GRÁTIS por 7 dias</span>
            <span className="text-green-200 text-sm">• Sem cartão de crédito</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative bg-gradient-to-br from-red-900/20 to-transparent border-2 transition-all hover:scale-105 ${
                plan.badge === "Mais Popular"
                  ? "border-yellow-500/50 shadow-xl shadow-yellow-500/20"
                  : "border-red-700/30"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    {plan.badge === "Mais Popular" ? <Star className="h-4 w-4" /> : <Crown className="h-4 w-4" />}
                    {plan.badge}
                  </span>
                </div>
              )}

              <CardHeader className="pt-8">
                <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                <CardDescription className="text-gray-300">{plan.description}</CardDescription>
                
                {/* Price */}
                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-yellow-400">R$ {plan.price}</span>
                    <span className="text-gray-400">/ {plan.period}</span>
                  </div>
                  {plan.savings && (
                    <p className="text-green-400 text-sm font-semibold mt-2">{plan.savings}</p>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-200">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    handleContactSupport();
                  }}
                  className={`w-full font-bold text-lg py-6 ${
                    plan.badge === "Mais Popular"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  Assinar Agora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Support Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-blue-900/20 to-transparent border-blue-700/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6 text-blue-400" />
                <CardTitle className="text-white">Precisa de Ajuda?</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Entre em contato com nosso suporte no Telegram para realizar o pagamento e ativar sua assinatura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleContactSupport}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-6 text-lg"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar com Suporte no Telegram
              </Button>
              <p className="text-center text-sm text-gray-400 mt-4">
                Aceitamos PIX, transferência bancária e outros métodos de pagamento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-center mb-6 text-yellow-400">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
              <CardHeader>
                <CardTitle className="text-lg text-white">Como funciona o período de teste?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Você tem 7 dias grátis para testar todas as funcionalidades do sistema. Não é necessário cadastrar cartão de crédito.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
              <CardHeader>
                <CardTitle className="text-lg text-white">Como faço para assinar?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Clique em "Assinar Agora" no plano desejado e entre em contato com nosso suporte no Telegram. Faremos todo o processo de ativação.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
              <CardHeader>
                <CardTitle className="text-lg text-white">Posso cancelar a qualquer momento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Sim! Você pode cancelar sua assinatura a qualquer momento. Entre em contato com o suporte.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-700/30">
              <CardHeader>
                <CardTitle className="text-lg text-white">Quais métodos de pagamento são aceitos?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Aceitamos PIX, transferência bancária e outros métodos. Entre em contato com o suporte para mais detalhes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

