import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { StrategyType } from "@shared/types";

interface StrategyFormProps {
  onSubmit: (data: {
    name: string;
    type: StrategyType;
    baseBetAmount: number;
    config: string;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: {
    name: string;
    type: StrategyType;
    baseBetAmount: number;
    config?: string;
  };
}

// Configurações específicas por tipo de estratégia
const StrategyConfigs = {
  flatBetting: {
    name: "Aposta Fixa",
    description: "Aposta sempre o mesmo valor independentemente de ganhar ou perder",
    fields: [],
  },
  fibonacci: {
    name: "Fibonacci",
    description: "Sequência de Fibonacci: 1, 1, 2, 3, 5, 8, 13...",
    fields: [
      {
        key: "sequenceStep",
        label: "Passo na Sequência",
        type: "number",
        default: 1,
        min: 1,
        description: "Número de passos na sequência após uma perda",
      },
      {
        key: "resetOnWin",
        label: "Resetar na Vitória",
        type: "boolean",
        default: true,
        description: "Voltar ao início da sequência após uma vitória",
      },
    ],
  },
  martingale: {
    name: "Martingale",
    description: "Dobra a aposta após cada perda até ganhar",
    fields: [
      {
        key: "multiplier",
        label: "Multiplicador",
        type: "number",
        default: 2.0,
        min: 1.1,
        step: 0.1,
        description: "Quanto multiplicar a aposta após uma perda (ex: 2.0 = dobra)",
      },
      {
        key: "maxSteps",
        label: "Máximo de Passos",
        type: "number",
        default: 5,
        min: 1,
        description: "Número máximo de aumentos antes de resetar",
      },
    ],
  },
  reverseMartingale: {
    name: "Reverse Martingale (Paroli)",
    description: "Aumenta a aposta após cada vitória, em vez de após perda",
    fields: [
      {
        key: "multiplier",
        label: "Multiplicador",
        type: "number",
        default: 2.0,
        min: 1.1,
        step: 0.1,
        description: "Quanto multiplicar a aposta após uma vitória (ex: 2.0 = dobra)",
      },
      {
        key: "maxWins",
        label: "Máximo de Vitórias",
        type: "number",
        default: 3,
        min: 1,
        description: "Número máximo de vitórias consecutivas antes de resetar",
      },
    ],
  },
  dalembert: {
    name: "D'Alembert",
    description: "Aumenta/diminui a aposta em uma unidade",
    fields: [
      {
        key: "unitAmount",
        label: "Valor da Unidade (R$)",
        type: "number",
        default: 1,
        min: 1,
        description: "Valor a ser adicionado/subtraído a cada rodada",
      },
      {
        key: "maxBetLimit",
        label: "Aposta Máxima (R$)",
        type: "number",
        default: 1000,
        min: 1,
        description: "Limite máximo de aposta permitida",
      },
    ],
  },
  labouchere: {
    name: "Labouchère",
    description: "Usa uma sequência customizada de números",
    fields: [
      {
        key: "initialSequence",
        label: "Sequência Inicial",
        type: "text",
        default: "1,2,3",
        description: "Números separados por vírgula (ex: 1,2,3,4,5)",
      },
      {
        key: "maxLosses",
        label: "Máximo de Perdas",
        type: "number",
        default: 10,
        min: 1,
        description: "Número máximo de perdas antes de resetar",
      },
    ],
  },
  custom: {
    name: "Customizada",
    description: "Configure sua própria estratégia com JSON",
    fields: [
      {
        key: "jsonConfig",
        label: "Configuração JSON",
        type: "textarea",
        default: "{}",
        description: "Defina sua própria configuração em formato JSON",
      },
    ],
  },
};

export default function StrategyForm({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}: StrategyFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: (initialData?.type || "fibonacci") as StrategyType,
    baseBetAmount: initialData?.baseBetAmount || 100,
    config: initialData?.config || "{}",
  });

  const [configValues, setConfigValues] = useState<Record<string, any>>(() => {
    if (initialData?.config && initialData.config !== "{}") {
      try {
        return JSON.parse(initialData.config);
      } catch {
        return {};
      }
    }
    return {};
  });

  const currentStrategy = StrategyConfigs[formData.type];
  const fields = currentStrategy.fields;

  const handleConfigChange = (key: string, value: any) => {
    const newConfigValues = { ...configValues, [key]: value };
    setConfigValues(newConfigValues);
    // Para flatBetting, não precisa de configuração
    const configStr = Object.keys(newConfigValues).length > 0 ? JSON.stringify(newConfigValues) : "{}";
    setFormData({
      ...formData,
      config: configStr,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Por favor, digite um nome para a estratégia");
      return;
    }

    onSubmit({
      name: formData.name,
      type: formData.type,
      baseBetAmount: formData.baseBetAmount,
      config: formData.config,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome da Estratégia */}
      <div>
        <Label htmlFor="name" className="text-sm font-medium text-white">
          Nome da Estratégia
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Fibonacci Conservador"
          className="mt-2 bg-slate-800 border-purple-700/30"
          required
        />
      </div>

      {/* Tipo de Estratégia */}
      <div>
        <Label htmlFor="type" className="text-sm font-medium text-white">
          Tipo de Estratégia
        </Label>
        <Select
          value={formData.type}
          onValueChange={(value) => {
            setFormData({ ...formData, type: value as StrategyType });
            setConfigValues({}); // Reset config values when changing type
          }}
        >
          <SelectTrigger id="type" className="mt-2 bg-slate-800 border-purple-700/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-purple-700/30">
            {Object.entries(StrategyConfigs).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-200 mt-2">{currentStrategy.description}</p>
      </div>

      {/* Aposta Base */}
      <div>
        <Label htmlFor="baseBet" className="text-sm font-medium text-white">
          Aposta Base (R$)
        </Label>
        <Input
          id="baseBet"
          type="number"
          value={formData.baseBetAmount}
          onChange={(e) => setFormData({ ...formData, baseBetAmount: parseFloat(e.target.value) })}
          placeholder="100"
          className="mt-2 bg-slate-800 border-purple-700/30"
          min="1"
          step="0.01"
          required
        />
        <p className="text-xs text-gray-200 mt-1">Valor inicial da aposta para esta estratégia</p>
      </div>

      {/* Campos Dinâmicos por Tipo */}
      {fields.length > 0 && (
        <Card className="bg-slate-800/50 border-purple-700/30">
          <CardHeader>
            <CardTitle className="text-base text-white">Configurações da Estratégia</CardTitle>
            <CardDescription>Customize os parâmetros da sua estratégia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field) => {
              const value = configValues[field.key] ?? field.default;

              if (field.type === "boolean") {
                return (
                  <div key={field.key} className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-white">{field.label}</Label>
                      <p className="text-xs text-gray-200 mt-1">{field.description}</p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => handleConfigChange(field.key, checked)}
                    />
                  </div>
                );
              }

              if (field.type === "number") {
                return (
                  <div key={field.key}>
                    <Label htmlFor={field.key} className="text-sm font-medium text-white">
                      {field.label}
                    </Label>
                    <Input
                      id={field.key}
                      type="number"
                      value={value}
                      onChange={(e) => handleConfigChange(field.key, parseFloat(e.target.value))}
                      min={field.min}
                      step={field.step || 1}
                      className="mt-2 bg-slate-700 border-purple-700/30"
                    />
                    <p className="text-xs text-gray-200 mt-1">{field.description}</p>
                  </div>
                );
              }

              if (field.type === "textarea") {
                return (
                  <div key={field.key}>
                    <Label htmlFor={field.key} className="text-sm font-medium text-white">
                      {field.label}
                    </Label>
                    <textarea
                      id={field.key}
                      value={value}
                      onChange={(e) => handleConfigChange(field.key, e.target.value)}
                      className="mt-2 w-full p-2 bg-slate-700 border border-purple-700/30 rounded text-sm font-mono"
                      rows={4}
                      placeholder={field.default}
                    />
                    <p className="text-xs text-gray-200 mt-1">{field.description}</p>
                  </div>
                );
              }

              // text
              return (
                <div key={field.key}>
                  <Label htmlFor={field.key} className="text-sm font-medium text-white">
                    {field.label}
                  </Label>
                  <Input
                    id={field.key}
                    type="text"
                    value={value}
                    onChange={(e) => handleConfigChange(field.key, e.target.value)}
                    className="mt-2 bg-slate-700 border-purple-700/30"
                    placeholder={field.default}
                  />
                  <p className="text-xs text-gray-200 mt-1">{field.description}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Botões */}
      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700 flex-1"
        >
          {isLoading ? "Salvando..." : "Salvar Estratégia"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

