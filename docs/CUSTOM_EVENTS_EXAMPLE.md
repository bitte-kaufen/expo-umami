# Custom Events, Impressions & Clicks Guide

This guide shows how to use the custom event tracking features in `@bitte-kaufen/expo-umami`.

## Understanding Event Types

When you track events, they can be classified as either:

1. **Pageviews** - Screen navigation without event name
2. **Custom Events** - Events with a `name` field (clicks, impressions, custom actions)

## Quick Reference

```typescript
// Pageview (no event name)
trackEvent('Home');
// -> Shows as pageview in Umami

// Custom Event (with event name)
trackEvent('Home', { name: 'button_click' });
// -> Shows as custom event named "button_click"

// Convenience methods
trackClick('Home/CTA');
// -> Custom event named "click"

trackImpression('Product/Card');
// -> Custom event named "impression"

trackCustomEvent('Home', 'video_play');
// -> Custom event named "video_play"
```

## Real-World Examples

### E-Commerce Product Card

```typescript
import { useEffect } from 'react';
import { trackImpression, trackClick, trackCustomEvent } from '@bitte-kaufen/expo-umami';

function ProductCard({ product, position }) {
  // Track when product is viewed (impression)
  useEffect(() => {
    trackImpression('ProductList/Card', {
      data: {
        productId: product.id,
        productName: product.name,
        price: product.price,
        position: position,
        category: product.category,
      },
    });
  }, [product, position]);

  const handleAddToCart = () => {
    trackClick('ProductList/AddToCart', {
      data: {
        productId: product.id,
        price: product.price,
        quantity: 1,
      },
    });
    // ... add to cart logic
  };

  const handleWishlist = () => {
    trackCustomEvent('ProductList/Card', 'add_to_wishlist', {
      data: {
        productId: product.id,
      },
    });
    // ... wishlist logic
  };

  const handleQuickView = () => {
    trackClick('ProductList/QuickView', {
      data: {
        productId: product.id,
      },
    });
    // ... quick view logic
  };

  return (
    <View>
      <Image source={product.image} />
      <Text>{product.name}</Text>
      <Text>${product.price}</Text>
      <Button onPress={handleAddToCart}>Add to Cart</Button>
      <Button onPress={handleWishlist}>Wishlist</Button>
      <Button onPress={handleQuickView}>Quick View</Button>
    </View>
  );
}
```

### Video Player Interactions

```typescript
import { trackCustomEvent } from '@bitte-kaufen/expo-umami';

function VideoPlayer({ videoId, videoTitle }) {
  const handlePlay = () => {
    trackCustomEvent('Video/Player', 'play', {
      data: {
        videoId,
        videoTitle,
        timestamp: 0,
      },
    });
  };

  const handlePause = (currentTime) => {
    trackCustomEvent('Video/Player', 'pause', {
      data: {
        videoId,
        currentTime,
        percentWatched: (currentTime / videoDuration) * 100,
      },
    });
  };

  const handleComplete = () => {
    trackCustomEvent('Video/Player', 'complete', {
      data: {
        videoId,
        videoTitle,
        duration: videoDuration,
      },
    });
  };

  const handleQualityChange = (quality) => {
    trackCustomEvent('Video/Player', 'quality_change', {
      data: {
        videoId,
        from: currentQuality,
        to: quality,
      },
    });
  };

  return <Video />;
}
```

### Form Tracking

```typescript
import { trackImpression, trackClick, trackCustomEvent } from '@bitte-kaufen/expo-umami';

function CheckoutForm() {
  // Track form view
  useEffect(() => {
    trackImpression('Checkout/Form');
  }, []);

  const handleFieldFocus = (fieldName) => {
    trackCustomEvent('Checkout/Form', 'field_focus', {
      data: { fieldName },
    });
  };

  const handleFormSubmit = async (formData) => {
    trackClick('Checkout/SubmitButton');

    try {
      await submitOrder(formData);
      trackCustomEvent('Checkout/Form', 'submit_success', {
        data: {
          totalAmount: formData.total,
          itemCount: formData.items.length,
          paymentMethod: formData.paymentMethod,
        },
      });
    } catch (error) {
      trackCustomEvent('Checkout/Form', 'submit_error', {
        data: {
          errorType: error.type,
          errorMessage: error.message,
        },
      });
    }
  };

  return <Form />;
}
```

### Banner/Ad Impressions

```typescript
import { useEffect, useRef } from 'react';
import { trackImpression, trackClick } from '@bitte-kaufen/expo-umami';

function BannerAd({ bannerId, position, campaign }) {
  const viewedRef = useRef(false);

  useEffect(() => {
    // Track impression only once
    if (!viewedRef.current) {
      trackImpression('Home/Banner', {
        data: {
          bannerId,
          position,
          campaign,
          timestamp: Date.now(),
        },
      });
      viewedRef.current = true;
    }
  }, [bannerId, position, campaign]);

  const handleBannerClick = () => {
    trackClick('Home/Banner', {
      data: {
        bannerId,
        position,
        campaign,
        destination: bannerLink,
      },
    });
    // ... navigate to banner destination
  };

  return <Pressable onPress={handleBannerClick}>{/* Banner content */}</Pressable>;
}
```

### Search & Filtering

```typescript
import { trackCustomEvent } from '@bitte-kaufen/expo-umami';

function SearchScreen() {
  const handleSearch = (query) => {
    trackCustomEvent('Search', 'query_submit', {
      data: {
        query,
        queryLength: query.length,
      },
    });
  };

  const handleFilterApply = (filters) => {
    trackCustomEvent('Search', 'filter_apply', {
      data: {
        activeFilters: Object.keys(filters).length,
        filters: filters,
      },
    });
  };

  const handleResultClick = (result, position) => {
    trackClick('Search/Result', {
      data: {
        resultId: result.id,
        position,
        query: searchQuery,
      },
    });
  };

  return <View />;
}
```

### Social Sharing

```typescript
import { trackCustomEvent } from '@bitte-kaufen/expo-umami';

function ShareButton({ content }) {
  const handleShare = async (platform) => {
    trackCustomEvent('Content', 'share_attempt', {
      data: {
        contentId: content.id,
        contentType: content.type,
        platform,
      },
    });

    try {
      await Share.share({
        message: content.message,
        url: content.url,
      });

      trackCustomEvent('Content', 'share_success', {
        data: {
          contentId: content.id,
          platform,
        },
      });
    } catch (error) {
      trackCustomEvent('Content', 'share_cancel', {
        data: {
          contentId: content.id,
          platform,
        },
      });
    }
  };

  return <Button onPress={() => handleShare('native')}>Share</Button>;
}
```

## Event Naming Best Practices

1. **Use descriptive names**: `button_click`, `video_play`, `form_submit`
2. **Use snake_case**: Consistent with Umami conventions
3. **Keep names under 50 characters**: Umami's limit
4. **Group related events**: `video_play`, `video_pause`, `video_complete`
5. **Use data for context**: Put variable data in the `data` field, not the event name

## Event Name Limits

- Maximum length: **50 characters**
- Event data cannot be sent without an event name
- Event names must be provided for custom events

## Viewing Events in Umami

- **Pageviews** appear on the main dashboard
- **Custom Events** appear on the Events page
- **Event Data** is accessible under the Properties tab
- You can filter and analyze events by name and data properties
