import React, { useState } from 'react';
import { EyeOff, Mic, Check, Palette } from 'lucide-react';
import type { UserSecurityConfig } from '../../types';

interface DisguiseSettingsProps {
  userConfig: UserSecurityConfig;
  onSaveConfig: (config: UserSecurityConfig) => void;
}

export const DisguiseSettings: React.FC<DisguiseSettingsProps> = ({ userConfig, onSaveConfig }) => {
  const [realPin, setRealPin] = useState(userConfig.realPin);
  const [fakePin, setFakePin] = useState(userConfig.fakePin);
  const [keyword, setKeyword] = useState(userConfig.keywordTrigger);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...userConfig,
      realPin,
      fakePin,
      keywordTrigger: keyword,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Camuflagem White Label da Empresa */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-4 h-4 text-shield-600" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Camuflagem White Label Ativa
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
          Para sua segurança máxima, este aplicativo é camuflado como o portal oficial de benefícios da sua empresa.
          Se alguém abrir seu celular, parecerá apenas o sistema institucional de trabalho.
        </p>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Empresa Contratante:</span>
            <span className="font-semibold text-slate-800">{userConfig.whiteLabel.companyName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Nome da Fachada no Celular:</span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
              {userConfig.whiteLabel.appPublicName}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Identificador Anônimo (Token Cego):</span>
            <span className="font-mono font-bold text-shield-700 bg-shield-50 px-2 py-0.5 rounded border border-shield-200">
              {userConfig.userAnonymousToken}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200">
            <span className="text-slate-500">Portabilidade Ampara:</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Vitalícia (sua conta continua ativa se mudar de emprego)
            </span>
          </div>
        </div>
      </div>

      {/* Configurações de Camuflagem */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <EyeOff className="w-3.5 h-3.5 text-brand-600" />
            <span>Configurações do Modo Discreto</span>
          </h3>
          {savedSuccess && (
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Salvo!
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              PIN Real (Acesso Ampara)
            </label>
            <input
              type="text"
              maxLength={6}
              value={realPin}
              onChange={(e) => setRealPin(e.target.value)}
              className="w-full text-center font-mono text-sm py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Abre a área de proteção Ampara.</span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              PIN Falso (App Fachada)
            </label>
            <input
              type="text"
              maxLength={6}
              value={fakePin}
              onChange={(e) => setFakePin(e.target.value)}
              className="w-full text-center font-mono text-sm py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Abre extrato e holerite fictício.</span>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">
            Palavra-chave de Acionamento por Voz
          </label>
          <div className="relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shield-500"
            />
            <Mic className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Dica: Uma palavra ou frase falada próxima ao celular que aciona o socorro de forma invisível.
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98"
        >
          Salvar Novas Definições de Segurança
        </button>
      </form>
    </div>
  );
};
