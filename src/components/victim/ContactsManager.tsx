import React, { useState } from 'react';
import { Users, UserPlus, Phone, ArrowUpDown, Trash2, Check, Info, Sparkles, ExternalLink } from 'lucide-react';
import type { TrustedContact } from '../../types';

interface ContactsManagerProps {
  contacts: TrustedContact[];
  onSaveContacts: (contacts: TrustedContact[]) => void;
  onSimulateContactView?: (contact: TrustedContact) => void;
}

export const ContactsManager: React.FC<ContactsManagerProps> = ({ 
  contacts, 
  onSaveContacts,
  onSimulateContactView 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [notes, setNotes] = useState('');
  const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || contacts.length >= 3) return;

    const newContact: TrustedContact = {
      id: 'c-' + Date.now(),
      name,
      phone,
      relationship: relationship || 'Amiga de confiança',
      order: contacts.length + 1,
      accepted: true,
      notes: notes || 'Pode ligar com pretexto amigável ou ir até o local.',
    };

    const updated = [...contacts, newContact];
    onSaveContacts(updated);
    setName('');
    setPhone('');
    setRelationship('');
    setNotes('');
    setShowAddModal(false);
  };

  const handleFillQuickExample = () => {
    setName('Renata Oliveira (Exemplo)');
    setPhone('(11) 98765-4321');
    setRelationship('Vizinha do prédio');
    setNotes('Bater à porta pedindo uma xícara de açúcar emprestada.');
  };

  const handleDelete = (id: string) => {
    const filtered = contacts.filter((c) => c.id !== id);
    const reordered = filtered.map((c, idx) => ({ ...c, order: idx + 1 }));
    onSaveContacts(reordered);
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= contacts.length) return;

    const reordered = [...contacts];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIdx, 0, moved);

    const finalized = reordered.map((c, idx) => ({ ...c, order: idx + 1 }));
    onSaveContacts(finalized);
  };

  const handleSimulateInviteCopy = (contact: TrustedContact) => {
    setCopiedInviteId(contact.id);
    if (onSimulateContactView) {
      onSimulateContactView(contact);
    }
    setTimeout(() => setCopiedInviteId(null), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-shield-600" />
            <span>Contatos de Confiança ({contacts.length}/3)</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Quem será avisado com link em tempo real e áudio caso você acione o socorro.
          </p>
        </div>

        {contacts.length < 3 && (
          <button
            onClick={() => {
              setName('');
              setPhone('');
              setRelationship('');
              setNotes('');
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Cadastrar</span>
          </button>
        )}
      </div>

      {/* Alerta de Boas Práticas */}
      <div className="bg-shield-50 border border-shield-200 rounded-2xl p-3.5 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-shield-600 shrink-0 mt-0.5" />
        <p className="text-xs text-shield-800 leading-relaxed">
          <strong className="font-semibold">Como escolher o contato:</strong> Cadastre pessoas que possam se aproximar
          com pretexto natural (uma vizinha de porta, amiga próxima ou irmã). A simples presença ou telefonema amigável interrompe a agressão.
        </p>
      </div>

      {/* Lista de Contatos */}
      <div className="space-y-3">
        {contacts.map((contact, index) => (
          <div
            key={contact.id}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs relative"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-shield-500 to-brand-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                  {contact.order}º
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{contact.name}</span>
                    <span className="text-[10px] font-normal text-slate-500 px-2 py-0.5 bg-slate-100 rounded-full">
                      {contact.relationship}
                    </span>
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{contact.phone}</span>
                  </div>
                  {contact.notes && (
                    <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <strong>Pretexto de socorro:</strong> "{contact.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Ações de Reordenação e Exclusão */}
              <div className="flex items-center gap-1">
                {index > 0 && (
                  <button
                    onClick={() => handleMoveOrder(index, 'up')}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                    title="Mover prioridade para cima"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remover contato"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Simulação do link de socorro para este contato */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                <Check className="w-3 h-3" />
                Rede Pronta
              </span>
              <button
                onClick={() => handleSimulateInviteCopy(contact)}
                className="text-shield-600 hover:text-shield-800 font-bold flex items-center gap-1 bg-shield-50 hover:bg-shield-100 px-2.5 py-1 rounded-lg transition-all"
                title="Abrir a tela exatamente como este contato vê no celular dele"
              >
                <span>{copiedInviteId === contact.id ? 'Abrindo tela...' : '📲 Simular Celular Deste Contato'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}

        {contacts.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-300 text-center">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-700">Nenhum contato cadastrado ainda</h4>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-1 mb-4">
              Cadastre pelo menos uma pessoa de confiança para receber seus alertas silenciosos.
            </p>
            <button
              onClick={() => {
                handleFillQuickExample();
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold"
            >
              Criar Exemplo de Contato
            </button>
          </div>
        )}
      </div>

      {/* Modal de Adicionar Contato */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Cadastrar Contato de Confiança</h3>
              <button
                type="button"
                onClick={handleFillQuickExample}
                className="text-[11px] text-brand-600 hover:text-brand-800 font-bold flex items-center gap-1 bg-brand-50 px-2 py-0.5 rounded-full"
                title="Preencher com dados fictícios para teste rápido"
              >
                <Sparkles className="w-3 h-3" />
                <span>Preencher Exemplo</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Esta pessoa receberá o alerta por WhatsApp/SMS com sua localização e áudio ambiente.
            </p>

            <form onSubmit={handleAddContact} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Nome completo ou apelido</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mariana Vizinha"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Telefone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 98765-4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Grau de Proximidade</label>
                <input
                  type="text"
                  placeholder="Ex: Vizinha de porta, Amiga, Irmã"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Pretexto de intervenção discreta</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Ligar perguntando sobre um casaco ou bater na porta para pedir açúcar..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl"
                >
                  Salvar Contato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
