from redis import Redis
from rq import Queue


redis_conn = Redis(host="redis", port=6379)
q = Queue(connection=redis_conn, default_timeout=3600)
