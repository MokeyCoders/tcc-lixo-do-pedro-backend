import Familia from '../familias/model';
import Herbario from '../herbarios/model';
import Subfamilia from '../subfamilias/model';
import Tombo from '../tombos/model';
import Usuario from './model';

function getRules(usuario: Usuario): App.Permission.Rule[] {
  return [
    {
      action: ['find', 'read'],
      subject: Tombo.name,
    },
    {
      action: ['read', 'update'],
      subject: Usuario.name,
      conditions: {
        id: usuario.id,
      },
    },
    {
      action: ['find', 'read', 'update'],
      subject: Herbario.name,
      conditions: {
        id: usuario.herbario.id,
      },
      permissions: [
        'CURADOR',
      ],
    },
    {
      action: ['read', 'find'],
      subject: Usuario.name,
      permissions: [
        'CURADOR',
      ],
    },
    {
      action: ['manage'],
      subject: 'all',
    },
  ];
}

function removeAttribute(rule: any): App.Permission.Rule {
  const r = { ...rule };
  delete r.permissions;
  return r;
}

function getUserRules(usuario: Usuario) {
  const rules = getRules(usuario);
  return rules
    .filter(rule => {
      if (!rule.permissions) {
        return true;
      }
      return rule.permissions.some(permission => {
        if (typeof permission === 'boolean') {
          return permission;
        }
        if (typeof permission === 'string') {
          return usuario.tipo?.tipo === permission;
        }
        if (typeof permission === 'function') {
          return permission(usuario);
        }
        return false;
      });
    })
    .map(removeAttribute);
}

export default getUserRules;
