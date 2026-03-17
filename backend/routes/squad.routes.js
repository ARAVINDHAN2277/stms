import express from 'express';
import prisma from '../utils/prisma.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { emitToUser } from '../utils/socketManager.js';

const router = express.Router();

// Create a Squad
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, logoUrl } = req.body;
    if (!name) return res.status(400).json({ error: 'Squad name is required' });

    const squad = await prisma.squad.create({
      data: {
        name,
        logoUrl,
        captainId: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: 'CAPTAIN'
          }
        }
      },
      include: {
        members: true
      }
    });

    res.status(201).json(squad);
  } catch (err) {
    console.error(err);
    if (err.code === 'P2002') return res.status(400).json({ error: 'Squad name already exists' });
    res.status(500).json({ error: 'Failed to create squad' });
  }
});

// Get My Squads
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const squads = await prisma.squadMember.findMany({
      where: { userId: req.user.id },
      include: {
        squad: {
          include: {
            members: { include: { user: { select: { username: true, email: true } } } },
            captain: { select: { username: true } }
          }
        }
      }
    });
    res.json(squads.map(m => m.squad));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch squads' });
  }
});

// Invite to Squad
router.post('/:id/invite', authMiddleware, async (req, res) => {
  try {
    const { email } = req.body;
    const squadId = req.params.id;

    const squad = await prisma.squad.findUnique({ where: { id: squadId } });
    if (squad.captainId !== req.user.id) return res.status(403).json({ error: 'Only captains can invite' });

    // Check if player exists
    const player = await prisma.user.findUnique({ where: { email } });
    if (!player) return res.status(404).json({ error: 'Player not found' });

    // Check if already in squad
    const existing = await prisma.squadMember.findFirst({
        where: { squadId, userId: player.id }
    });
    if (existing) return res.status(400).json({ error: 'Player already in squad' });

    const invite = await prisma.squadInvite.create({
      data: { squadId, email }
    });

    // Real-time notification
    emitToUser(player.id, 'new_squad_invite', { squadId, squadName: squad.name });

    res.json({ message: 'Invitation sent', invite });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send invite' });
  }
});

// Accept Invitation
router.post('/invites/:inviteId/accept', authMiddleware, async (req, res) => {
  try {
    const invite = await prisma.squadInvite.findUnique({
      where: { id: req.params.inviteId },
      include: { squad: true }
    });

    if (!invite || invite.email !== req.user.email) return res.status(404).json({ error: 'Invite not found' });
    if (invite.status !== 'PENDING') return res.status(400).json({ error: 'Invite already processed' });

    // Add to squad
    await prisma.$transaction([
      prisma.squadMember.create({
        data: { squadId: invite.squadId, userId: req.user.id }
      }),
      prisma.squadInvite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED' }
      })
    ]);

    res.json({ message: 'Squad joined successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to join squad' });
  }
});

// Reject Invitation
router.post('/invites/:inviteId/reject', authMiddleware, async (req, res) => {
    try {
      const invite = await prisma.squadInvite.findUnique({
        where: { id: req.params.inviteId }
      });
  
      if (!invite || invite.email !== req.user.email) return res.status(404).json({ error: 'Invite not found' });
  
      await prisma.squadInvite.update({
        where: { id: invite.id },
        data: { status: 'REJECTED' }
      });
  
      res.json({ message: 'Invitation rejected' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to reject invite' });
    }
});

// Get My Pending Invites
router.get('/invites/pending', authMiddleware, async (req, res) => {
    try {
      const invites = await prisma.squadInvite.findMany({
        where: { email: req.user.email, status: 'PENDING' },
        include: { squad: { include: { captain: { select: { username: true } } } } }
      });
      res.json(invites);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch invitations' });
    }
});

export default router;
