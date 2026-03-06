export interface Account {
  id: string
  name: string
  industry: string
  type: 'Customer' | 'Prospect'
}

export interface MentionIndices {
  title: [number, number][]
  text: [number, number][]
}

export interface ArticleIndices {
  [accountId: string]: MentionIndices
}

export interface Article {
  id: string
  title: string
  text: string
  timestamp: number
  source: string
  indices: ArticleIndices
}

export interface AccountWithMention extends Account {
  mentionCount: number
}
