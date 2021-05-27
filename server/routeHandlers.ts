import express from 'express';
import { IAppServices } from './app/AppServices';
import { AppConfig } from './config';
import { CharityStatus } from './app/Charity/dto/CharityStatus';
import { CharityStripeStatus } from './app/Charity/dto/CharityStripeStatus';

export default function appRouteHandlers(app: express.Express, { auction, charity, stripe }: IAppServices): void {
  app.use((req, res, next) => {
    if (req.originalUrl === '/api/v1/stripe/') {
      next();
    } else {
      express.json()(req, res, next);
    }
  });

  app.post('/api/v1/auctions-settle', async (req, res) => {
    if (!req.body.key) {
      res.sendStatus(401).json({ message: 'UNAUTHORIZED' });
      return;
    }

    if (req.body.key !== AppConfig.googleCloud.schedulerSecretKey) {
      res.sendStatus(401).json({ message: 'UNAUTHORIZED' });
      return;
    }
    return res.json(auction.scheduleAuctionJobSettle());
  });

  app.post('/api/v1/auctions-start', async (req, res) => {
    if (!req.body.key) {
      res.sendStatus(401).json({ message: 'UNAUTHORIZED' });
      return;
    }

    if (req.body.key !== AppConfig.googleCloud.schedulerSecretKey) {
      res.sendStatus(401).json({ message: 'UNAUTHORIZED' });
      return;
    }
    return res.json(auction.scheduleAuctionJobStart());
  });

  app.get('/api/v1/account_onboarding', async (req: express.Request, res: express.Response) => {
    const { user_id: userId } = req.query;
    if (!userId || typeof userId !== 'string') {
      res.redirect(AppConfig.app.url);
      return;
    }

    const currentCharity = await charity.findCharity(userId);
    const redirectToUrl = `${AppConfig.app.url}/charity/me/edit`;

    if (currentCharity?.status !== CharityStatus.PENDING_ONBOARDING) {
      res.redirect(redirectToUrl);
      return;
    }

    await charity.updateCharityStatus({
      charity: currentCharity,
      stripeStatus: CharityStripeStatus.PENDING_VERIFICATION,
    });

    res.redirect(redirectToUrl);
  });

  app.post('/api/v1/stripe/', express.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature'];

    if (!sig) {
      response.sendStatus(401).json({ message: 'UNAUTHORIZED' });
      return;
    }

    let event;
    try {
      event = stripe.constructEvent(request.body, sig as string);
    } catch (err) {
      response.sendStatus(400).json({ message: err.message });
      return;
    }

    if (event.type === 'account.updated') {
      try {
        await charity.updateCharityByStripeAccount(event.data.object);
      } catch (err) {
        response.sendStatus(400).json({ message: err.message });
        return;
      }
    }

    response.sendStatus(200);
  });
}
