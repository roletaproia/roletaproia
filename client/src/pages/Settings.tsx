import Layout from "@/components/Layout";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";

export default function Settings() {
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 text-yellow-400">
            <SettingsIcon className="h-8 w-8 text-yellow-400" />
            Configurações
          </h1>
          <p className="text-gray-200">Esta página não é mais necessária, pois o sistema não possui login de usuário.</p>
        </div>
      </div>
    </Layout>
  );
}

