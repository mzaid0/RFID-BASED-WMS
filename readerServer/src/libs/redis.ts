import { Redis } from "ioredis";
import { createClient } from "redis";
export const redisClient = createClient()

redisClient
    .on('error', err => console.log('Redis Client Error', err))
    .connect()
    .then(()=>console.log("Redis connected."))
    
export const redis = new Redis()