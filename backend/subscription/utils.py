from db.models import AIImage, Render, User, Image, Video, Template, SubscriptionTier, get_db
from fastapi import HTTPException
from slack_bot.slack import send_slack_message


from sqlalchemy.orm import Session


LIMIT_DICT = {
    Render.__name__: {
        SubscriptionTier.FREE.value: 1,
        SubscriptionTier.STARTER_MONTHLY.value: 10,
        SubscriptionTier.STARTER_YEARLY.value: 10 * 12,
        SubscriptionTier.PRO_MONTHLY.value: 100,
        SubscriptionTier.PRO_YEARLY.value: 100 * 12,
        SubscriptionTier.PREMIUM_MONTHLY.value: "unlimited",
        SubscriptionTier.PREMIUM_YEARLY.value: "unlimited",
    },
    Image.__name__: {
        SubscriptionTier.FREE.value: 5,
        SubscriptionTier.STARTER_MONTHLY.value: 30,
        SubscriptionTier.STARTER_YEARLY.value: 30 * 12,
        SubscriptionTier.PRO_MONTHLY.value: 100,
        SubscriptionTier.PRO_YEARLY.value: 100 * 12,
        SubscriptionTier.PREMIUM_MONTHLY.value: "unlimited",
        SubscriptionTier.PREMIUM_YEARLY.value: "unlimited",
    },
    Video.__name__: {
        SubscriptionTier.FREE.value: 1,
        SubscriptionTier.STARTER_MONTHLY.value: 5,
        SubscriptionTier.STARTER_YEARLY.value: 5 * 12,
        SubscriptionTier.PRO_MONTHLY.value: 15,
        SubscriptionTier.PRO_YEARLY.value: 15 * 12,
        SubscriptionTier.PREMIUM_MONTHLY.value: "unlimited",
        SubscriptionTier.PREMIUM_YEARLY.value: "unlimited",
    },
    Template.__name__: {
        SubscriptionTier.FREE.value: 0,
        SubscriptionTier.STARTER_MONTHLY.value: 10,
        SubscriptionTier.STARTER_YEARLY.value: 10,
        SubscriptionTier.PRO_MONTHLY.value: 30,
        SubscriptionTier.PRO_YEARLY.value: 30,
        SubscriptionTier.PREMIUM_MONTHLY.value: "unlimited",
        SubscriptionTier.PREMIUM_YEARLY.value: "unlimited",
    },
    AIImage.__name__: {
        SubscriptionTier.FREE.value: 0,
        SubscriptionTier.STARTER_MONTHLY.value: 10,
        SubscriptionTier.STARTER_YEARLY.value: 10 * 12,
        SubscriptionTier.PRO_MONTHLY.value: 50,
        SubscriptionTier.PRO_YEARLY.value: 50 * 12,
        SubscriptionTier.PREMIUM_MONTHLY.value: 100,
        SubscriptionTier.PREMIUM_YEARLY.value: 100 * 12,
    },
}


def check_limits(model, user: User, db: Session, is_monthy: bool = True):
    if model.__name__ not in LIMIT_DICT:
        print(f"Model {model.__name__} not in limit dict")
        return

    limit = LIMIT_DICT[model.__name__][user.subscription_tier]
    if limit == "unlimited":
        return

    if is_monthy:
        usage = (
            db.query(model)
            .filter(model.user_id == user.id)
            .filter(model.created_at > user.subscription_payment_at)
            .count()
        )
    else:
        usage = db.query(model).filter(model.user_id == user.id).count()

    if usage >= limit:
        send_slack_message(f"Limit exceeded for {model.__name__}s for user {user.email}")
        raise HTTPException(status_code=403, detail="Limit exceeded")
