/**
 * Represents a friend's link.
 */
export interface FriendsLink {
  /**
   * The icon associated with the link.
   * It can be a string representing the icon name or an object with an SVG string.
   */
  icon?: string | { svg: string }

  /**
   * The badge associated with the link.
   * It can be a string representing the badge text or an object with text and type properties.
   */
  badge?:
    | string
    | {
        /**
         * The text displayed on the badge.
         */
        text?: string

        /**
         * The type of the badge.
         * It can be one of 'info', 'tip', 'warning', or 'danger'.
         */
        type?: 'info' | 'tip' | 'warning' | 'danger'
      }

  /**
   * The title of the link.
   */
  title: string

  /**
   * The description of the link.
   */
  desc?: string

  /**
   * The URL of the link.
   */
  link: string
}
  
export interface FriendsData {
  title: string
  items: FriendsLink[]
}