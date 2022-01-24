export interface CreateVideoFromAudioStorage {
  create: (path: string) => Promise<string>
}
