import { MessagesTypes } from "./mesage";

export interface ChannelsTypes {
  label: string;
  value: string;
  type: number;
  guild: string;
  id: string;
  guildId: string;
  parentId: string | null;
  permissionOverwrites: string[];
  name: string;
  rawPosition: number;
  createdTimestamp: number;
  messages?: MessagesTypes[];
  threads?: string[];
  nsfw?: boolean;
  topic?: string | null;
  rtcRegion?: string | null;
  lastMessageId?: string | null;
  rateLimitPerUser?: number | null;
  bitrate?: number | null;
  userLimit?: number | null;
  videoQualityMode?: number | null;
  pointStart?: number;
  pointInterval?: number;
}
