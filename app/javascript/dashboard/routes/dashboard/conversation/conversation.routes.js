/* eslint arrow-body-style: 0 */
import { ACCOUNT_PERMISSIONS } from '../../../constants/permissions';
import { frontendURL } from '../../../helper/URLHelper';
const ConversationView = () => import('./ConversationView');

const GENERIC_CONVERSATION_PERMISSIONS = [
  ACCOUNT_PERMISSIONS.CONVERSATION_MANAGE,
  ACCOUNT_PERMISSIONS.CONVERSATION_PARTICIPATING_MANAGE,
  ACCOUNT_PERMISSIONS.CONVERSATION_UNASSIGNED_MANAGE,
];

export default {
  routes: [
    {
      path: frontendURL('accounts/:accountId/dashboard'),
      name: 'home',
      meta: { permissions: GENERIC_CONVERSATION_PERMISSIONS },
      component: ConversationView,
      props: () => {
        return { inboxId: 0 };
      },
    },
    {
      path: frontendURL('accounts/:accountId/conversations/:conversation_id'),
      name: 'inbox_conversation',
      meta: { permissions: GENERIC_CONVERSATION_PERMISSIONS },
      component: ConversationView,
      props: route => {
        return { inboxId: 0, conversationId: route.params.conversation_id };
      },
    },
    {
      path: frontendURL('accounts/:accountId/inbox/:inbox_id'),
      name: 'inbox_dashboard',
      meta: { permissions: GENERIC_CONVERSATION_PERMISSIONS },
      component: ConversationView,
      props: route => {
        return { inboxId: route.params.inbox_id };
      },
    },
    {
      path: frontendURL(
        'accounts/:accountId/inbox/:inbox_id/conversations/:conversation_id'
      ),
      name: 'conversation_through_inbox',
      meta: { permissions: GENERIC_CONVERSATION_PERMISSIONS },
      component: ConversationView,
      props: route => {
        return {
          conversationId: route.params.conversation_id,
          inboxId: route.params.inbox_id,
        };
      },
    },
    {
      path: frontendURL('accounts/:accountId/label/:label'),
      name: 'label_conversations',
      meta: { permissions: GENERIC_CONVERSATION_PERMISSIONS },
      component: ConversationView,
      props: route => ({ label: route.params.label }),
    },
    {
      path: frontendURL(
        'accounts/:accountId/label/:label/conversations/:conversation_id'
      ),
      name: 'conversations_through_label',
      meta: { permissions: GENERIC_CONVERSATION_PERMISSIONS },
      component: ConversationView,
      props: route => ({
        conversationId: route.params.conversation_id,
        label: route.params.label,
      }),
    },
    {
      path: frontendURL('accounts/:accountId/team/:teamId'),
      name: 'team_conversations',
      meta: { permissions: GENERIC_CONVERSATION_PERMISSIONS },
      component: ConversationView,
      props: route => ({ teamId: route.params.teamId }),
    },
    {
      path: frontendURL(
        'accounts/:accountId/team/:teamId/conversations/:conversationId'
      ),
      name: 'conversations_through_team',
      meta: { permissions: GENERIC_CONVERSATION_PERMISSIONS },
      component: ConversationView,
      props: route => ({
        conversationId: route.params.conversationId,
        teamId: route.params.teamId,
      }),
    },
    {
      path: frontendURL('accounts/:accountId/custom_view/:id'),
      name: 'folder_conversations',
      meta: { permissions: GENERIC_CONVERSATION_PERMISSIONS },
      component: ConversationView,
      props: route => ({ foldersId: route.params.id }),
    },
    {
      path: frontendURL(
        'accounts/:accountId/custom_view/:id/conversations/:conversation_id'
      ),
      name: 'conversations_through_folders',
      meta: { permissions: GENERIC_CONVERSATION_PERMISSIONS },
      component: ConversationView,
      props: route => ({
        conversationId: route.params.conversation_id,
        foldersId: route.params.id,
      }),
    },
    {
      path: frontendURL('accounts/:accountId/mentions/conversations'),
      name: 'conversation_mentions',
      meta: { permissions: GENERIC_CONVERSATION_PERMISSIONS },
      component: ConversationView,
      props: () => ({ conversationType: 'mention' }),
    },
    {
      path: frontendURL(
        'accounts/:accountId/mentions/conversations/:conversationId'
      ),
      name: 'conversation_through_mentions',
      meta: { permissions: GENERIC_CONVERSATION_PERMISSIONS },
      component: ConversationView,
      props: route => ({
        conversationId: route.params.conversationId,
        conversationType: 'mention',
      }),
    },
    {
      path: frontendURL('accounts/:accountId/unattended/conversations'),
      name: 'conversation_unattended',
      meta: { permissions: GENERIC_CONVERSATION_PERMISSIONS },
      component: ConversationView,
      props: () => ({ conversationType: 'unattended' }),
    },
    {
      path: frontendURL(
        'accounts/:accountId/unattended/conversations/:conversationId'
      ),
      name: 'conversation_through_unattended',
      meta: { permissions: GENERIC_CONVERSATION_PERMISSIONS },
      component: ConversationView,
      props: route => ({
        conversationId: route.params.conversationId,
        conversationType: 'unattended',
      }),
    },
    {
      path: frontendURL('accounts/:accountId/participating/conversations'),
      name: 'conversation_participating',
      component: ConversationView,
      meta: {
        permissions: [
          ACCOUNT_PERMISSIONS.CONVERSATION_MANAGE,
          ACCOUNT_PERMISSIONS.CONVERSATION_PARTICIPATING_MANAGE,
        ],
      },
      props: () => ({ conversationType: 'participating' }),
    },
    {
      path: frontendURL(
        'accounts/:accountId/participating/conversations/:conversationId'
      ),
      name: 'conversation_through_participating',
      component: ConversationView,
      meta: {
        permissions: [
          ACCOUNT_PERMISSIONS.CONVERSATION_MANAGE,
          ACCOUNT_PERMISSIONS.CONVERSATION_PARTICIPATING_MANAGE,
        ],
      },
      props: route => ({
        conversationId: route.params.conversationId,
        conversationType: 'participating',
      }),
    },
  ],
};
