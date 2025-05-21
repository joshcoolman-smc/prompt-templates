# Card Component System

## Overview
Create a versatile card component system that can display various types of content with consistent styling while supporting multiple variants, orientations, and interactive states.

## Requirements

### Component Requirements
- Support different content types (text, image, video, mixed)
- Provide multiple variants (elevated, outlined, filled)
- Support both vertical and horizontal layouts
- Include hover and focus states
- Ensure full accessibility
- Support clickable and non-clickable versions
- Allow for customization through props
### Visual Requirements
- Consistent padding and spacing
- Support for media content (top, left, right)
- Consistent typography following design system
- Proper handling of overflow content
- Support for footer actions (buttons, links)
- Optional header with title and subtitle

## Implementation Steps

### 1. Create Basic Component Structure

Create the following files:
- `src/components/ui/Card/index.ts` - Exports
- `src/components/ui/Card/Card.tsx` - Main component
- `src/components/ui/Card/CardHeader.tsx` - Header subcomponent
- `src/components/ui/Card/CardContent.tsx` - Content subcomponent
- `src/components/ui/Card/CardMedia.tsx` - Media subcomponent
- `src/components/ui/Card/CardFooter.tsx` - Footer/actions subcomponent
- `src/components/ui/Card/types.ts` - Type definitions
### 2. Define Component Types

Create `src/components/ui/Card/types.ts`:

```typescript
import { ReactNode, ElementType } from 'react';

export type CardVariant = 'elevated' | 'outlined' | 'filled';
export type CardOrientation = 'vertical' | 'horizontal';
export type CardSize = 'small' | 'medium' | 'large';

export interface CardProps {
  /** Card variant styling */
  variant?: CardVariant;
  
  /** Card orientation (vertical or horizontal) */
  orientation?: CardOrientation;
  
  /** Card size */
  size?: CardSize;
  
  /** Whether the card is clickable */
  clickable?: boolean;
  
  /** URL to navigate to when card is clicked */
  href?: string;
  
  /** onClick handler for the card */
  onClick?: () => void;
  
  /** Card children */
  children: ReactNode;
  
  /** Additional CSS classes */
  className?: string;
  
  /** HTML element to render the card as */
  as?: ElementType;
}

export interface CardHeaderProps {
  /** Card title */
  title: ReactNode;
  
  /** Optional subtitle */
  subtitle?: ReactNode;
  
  /** Optional action component (icon button, menu, etc.) */
  action?: ReactNode;
  
  /** Additional CSS classes */
  className?: string;
}
export interface CardMediaProps {
  /** Image source URL */
  src: string;
  
  /** Alt text for the image */
  alt: string;
  
  /** Optional overlay content */
  overlay?: ReactNode;
  
  /** Media position (only used in horizontal orientation) */
  position?: 'top' | 'left' | 'right';
  
  /** Additional CSS classes */
  className?: string;
}

export interface CardContentProps {
  /** Content children */
  children: ReactNode;
  
  /** Whether to apply padding */
  noPadding?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

export interface CardFooterProps {
  /** Footer children */
  children: ReactNode;
  
  /** Whether to align items at the end */
  alignEnd?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}
```

### 3. Implement Card Component

Create `src/components/ui/Card/Card.tsx`:

```tsx
import { forwardRef } from 'react';
import { CardProps } from './types';

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = 'elevated',
    orientation = 'vertical',
    size = 'medium',
    clickable = false,
    href,
    onClick,
    children,
    className = '',
    as: Component = 'div',
  },
  ref
) {
  // Determine if card should be a link
  const isLink = !!href;
  
  // If card is a link, change component to 'a'
  const CardComponent = isLink ? 'a' : Component;
  
  // Base classes for different variants
  const variantClasses = {
    elevated: 'bg-white shadow-md hover:shadow-lg',
    outlined: 'bg-white border border-gray-200 hover:border-gray-300',
    filled: 'bg-gray-50 hover:bg-gray-100',
  };
  
  // Size classes
  const sizeClasses = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6',
  };
  
  // Orientation classes
  const orientationClasses = {
    vertical: 'flex flex-col',
    horizontal: 'flex flex-row',
  };
  
  // Interactive classes for clickable cards
  const interactiveClasses = clickable || isLink
    ? 'cursor-pointer transition-all duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50'
    : '';
  
  // Combine all classes
  const cardClasses = `
    rounded-lg overflow-hidden
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${orientationClasses[orientation]}
    ${interactiveClasses}
    ${className}
  `;
  
  return (
    <CardComponent
      ref={ref}
      className={cardClasses}
      href={href}
      onClick={onClick}
      {...(isLink ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </CardComponent>
  );
});
```
### 4. Implement Card Header Component

Create `src/components/ui/Card/CardHeader.tsx`:

```tsx
import { CardHeaderProps } from './types';

export function CardHeader({ title, subtitle, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`flex justify-between items-start mb-4 ${className}`}>
      <div>
        {typeof title === 'string' ? (
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        ) : (
          title
        )}
        
        {subtitle && (
          <div className="mt-1 text-sm text-gray-600">
            {subtitle}
          </div>
        )}
      </div>
      
      {action && (
        <div className="ml-4">{action}</div>
      )}
    </div>
  );
}
```

### 5. Implement Card Media Component

Create `src/components/ui/Card/CardMedia.tsx`:

```tsx
import { CardMediaProps } from './types';

export function CardMedia({
  src,
  alt,
  overlay,
  position = 'top',
  className = '',
}: CardMediaProps) {
  // Position-based classes
  const positionClasses = {
    top: 'w-full h-48 object-cover',
    left: 'w-1/3 h-full object-cover',
    right: 'w-1/3 h-full object-cover order-last',
  };
  
  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`${positionClasses[position]}`}
      />
      
      {overlay && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          {overlay}
        </div>
      )}
    </div>
  );
}
```

### 6. Implement Card Content Component

Create `src/components/ui/Card/CardContent.tsx`:

```tsx
import { CardContentProps } from './types';

export function CardContent({
  children,
  noPadding = false,
  className = '',
}: CardContentProps) {
  return (
    <div className={`flex-grow ${noPadding ? '' : 'px-4'} ${className}`}>
      {children}
    </div>
  );
}
```

### 7. Implement Card Footer Component

Create `src/components/ui/Card/CardFooter.tsx`:

```tsx
import { CardFooterProps } from './types';

export function CardFooter({
  children,
  alignEnd = false,
  className = '',
}: CardFooterProps) {
  return (
    <div
      className={`
        mt-4 pt-3 border-t border-gray-100
        flex items-center ${alignEnd ? 'justify-end' : 'justify-start'}
        gap-2
        ${className}
      `}
    >
      {children}
    </div>
  );
}
```

### 8. Create Barrel Exports

Create `src/components/ui/Card/index.ts`:

```typescript
export { Card } from './Card';
export { CardHeader } from './CardHeader';
export { CardContent } from './CardContent';
export { CardMedia } from './CardMedia';
export { CardFooter } from './CardFooter';
export type {
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardMediaProps,
  CardFooterProps,
  CardVariant,
  CardOrientation,
  CardSize,
} from './types';
```

### 9. Create Example Usage and Variants

Create a demo page to showcase different card variants:

```tsx
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardFooter,
} from '@/components/ui/Card';

function CardShowcase() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Card Component</h1>
      
      <h2 className="text-2xl font-semibold mb-4">Basic Variants</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Elevated Card */}
        <Card variant="elevated">
          <CardHeader
            title="Elevated Card"
            subtitle="With drop shadow"
          />
          <CardContent>
            <p>This card has a drop shadow that increases on hover.</p>
          </CardContent>
        </Card>        
        {/* Outlined Card */}
        <Card variant="outlined">
          <CardHeader
            title="Outlined Card"
            subtitle="With border"
          />
          <CardContent>
            <p>This card has a border that changes color on hover.</p>
          </CardContent>
        </Card>
        
        {/* Filled Card */}
        <Card variant="filled">
          <CardHeader
            title="Filled Card"
            subtitle="With background"
          />
          <CardContent>
            <p>This card has a background color that changes on hover.</p>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">With Media</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Media Top Card */}
        <Card>
          <CardMedia
            src="/images/sample1.jpg"
            alt="Sample image"
          />
          <CardContent>
            <CardHeader
              title="Media Top Card"
              subtitle="With image above content"
            />
            <p>This card displays an image above the content area.</p>
          </CardContent>
          <CardFooter>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-md">
              Action
            </button>
          </CardFooter>
        </Card>
        
        {/* Horizontal Card */}
        <Card orientation="horizontal">
          <CardMedia
            src="/images/sample2.jpg"
            alt="Sample image"
            position="left"
          />
          <CardContent>
            <CardHeader
              title="Horizontal Card"
              subtitle="With image on the left"
            />
            <p>This card uses a horizontal layout with an image on the left side.</p>
            <CardFooter alignEnd>
              <button className="px-4 py-2 border border-primary-600 text-primary-600 rounded-md">
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md">
                Submit
              </button>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Interactive Cards</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Clickable Card */}
        <Card
          clickable
          onClick={() => alert('Card clicked!')}
        >
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Clickable Card</h3>
            <p>Click this card to trigger an action.</p>
          </CardContent>
        </Card>
        
        {/* Link Card */}
        <Card
          href="https://example.com"
        >
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Link Card</h3>
            <p>This card links to an external URL.</p>
          </CardContent>
        </Card>
        
        {/* Card with Overlay */}
        <Card>
          <CardMedia
            src="/images/sample3.jpg"
            alt="Sample image"
            overlay={
              <div className="text-white text-center p-4">
                <h3 className="text-xl font-bold">Overlay Content</h3>
                <p>Content on top of the image</p>
              </div>
            }
          />
          <CardContent>
            <p className="mt-2">Card with content overlay on the image.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### 10. Add Accessibility Enhancements

Update the Card component to include proper ARIA attributes:

```typescript
// Add to the Card component
const ariaProps = clickable || isLink
  ? {
      role: 'button',
      tabIndex: 0,
      'aria-label': typeof children === 'string' ? children : undefined,
    }
  : {};

// Add to the JSX return
<CardComponent
  ref={ref}
  className={cardClasses}
  href={href}
  onClick={onClick}
  {...(isLink ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
  {...ariaProps}
>
  {children}
</CardComponent>
```

## Expected Output

A complete, versatile card component system that:

1. Supports multiple visual variants (elevated, outlined, filled)
2. Works in both vertical and horizontal orientations
3. Accommodates various content types (text, images, mixed)
4. Provides interactive options (clickable, links)
5. Is fully accessible
6. Follows consistent styling from your design system
7. Is easily extensible for specific use cases
## Usage Examples

### Basic Card

```tsx
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

<Card>
  <CardHeader 
    title="Card Title" 
    subtitle="Card subtitle" 
  />
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
</Card>
```

### Card with Image and Actions

```tsx
import { Card, CardHeader, CardContent, CardMedia, CardFooter } from '@/components/ui/Card';

<Card variant="elevated">
  <CardMedia 
    src="/image.jpg" 
    alt="Description" 
  />
  <CardContent>
    <CardHeader 
      title="Featured Article" 
      subtitle="May 20, 2025" 
    />
    <p>This is a featured article with important information.</p>
  </CardContent>
  <CardFooter>
    <button className="px-4 py-2 bg-primary-600 text-white rounded-md">
      Read More
    </button>
  </CardFooter>
</Card>
```

### Horizontal Card

```tsx
import { Card, CardContent, CardMedia } from '@/components/ui/Card';

<Card orientation="horizontal">
  <CardMedia 
    src="/product.jpg" 
    alt="Product" 
    position="left" 
  />
  <CardContent>
    <h3 className="text-lg font-semibold">Product Name</h3>
    <p className="text-gray-600">Product description with details.</p>
    <div className="mt-4">
      <span className="text-xl font-bold text-primary-600">$49.99</span>
      <button className="ml-4 px-3 py-1 bg-primary-600 text-white rounded-md">
        Add to Cart
      </button>
    </div>
  </CardContent>
</Card>
```
### Clickable Card

```tsx
import { Card, CardContent } from '@/components/ui/Card';

<Card 
  clickable 
  onClick={() => navigateToProduct(product.id)}
>
  <CardContent>
    <h3 className="text-lg font-semibold">Clickable Card</h3>
    <p>Click anywhere on this card to trigger an action.</p>
  </CardContent>
</Card>
```

## Design Considerations

- **Consistency**: Cards maintain consistent padding, typography, and spacing
- **Flexibility**: The component system allows for various content types and layouts
- **Accessibility**: Proper ARIA attributes and keyboard navigation are included
- **Performance**: The component is optimized for minimal re-renders
- **Extensibility**: The system can be extended with new variants or features

## Next Steps

After implementing the base card component:

1. Create specialized card variants for specific use cases (profile cards, pricing cards, etc.)
2. Add support for lazy loading of card media
3. Implement card skeleton loading states for async content
4. Add animation for card interactions
5. Create a card grid/masonry layout component for displaying multiple cards