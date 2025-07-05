# Multi-Factor Authentication (MFA) Patterns

## Overview

This reference guide covers advanced Multi-Factor Authentication patterns for Supabase applications. These patterns are for enterprise applications or high-security requirements.

## Multi-Factor Authentication Setup

### Enable MFA for Users

```typescript
// Enable MFA enrollment for a user
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp',
  friendlyName: 'Work Phone'
});

if (error) {
  console.error('MFA enrollment failed:', error.message);
  return;
}

// data contains:
// - id: factor ID
// - qr_code: QR code for authenticator apps
// - secret: backup secret
// - uri: TOTP URI
```

### Verify MFA Challenge

```typescript
// Step 1: Challenge the user for MFA
const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
  factorId: 'factor-id-from-enrollment'
});

if (challengeError) {
  console.error('MFA challenge failed:', challengeError.message);
  return;
}

// Step 2: Verify the user's code
const { data, error } = await supabase.auth.mfa.verify({
  factorId: 'factor-id',
  challengeId: challengeData.id,
  code: '123456' // Code from user's authenticator app
});

if (error) {
  console.error('MFA verification failed:', error.message);
  return;
}

// User is now authenticated with MFA
```

### List User's MFA Factors

```typescript
const { data: factors, error } = await supabase.auth.mfa.listFactors();

if (error) {
  console.error('Failed to list MFA factors:', error.message);
  return;
}

factors.totp.forEach(factor => {
  console.log(`Factor: ${factor.friendly_name}, Status: ${factor.status}`);
});
```

### Remove MFA Factor

```typescript
const { data, error } = await supabase.auth.mfa.unenroll({
  factorId: 'factor-id-to-remove'
});

if (error) {
  console.error('Failed to remove MFA factor:', error.message);
  return;
}

console.log('MFA factor removed successfully');
```

## MFA Integration Patterns

### React Component for MFA Setup

```typescript
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function MFASetup() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [factorId, setFactorId] = useState<string | null>(null);

  const supabase = createClient();

  const enrollMFA = async () => {
    setIsEnrolling(true);
    
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Authenticator App'
    });

    if (error) {
      console.error('MFA enrollment failed:', error.message);
      setIsEnrolling(false);
      return;
    }

    setQrCode(data.qr_code);
    setSecret(data.secret);
    setFactorId(data.id);
    setIsEnrolling(false);
  };

  const verifyMFA = async () => {
    if (!factorId || !verificationCode) return;

    // Challenge first
    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId
    });

    if (challengeError) {
      console.error('MFA challenge failed:', challengeError.message);
      return;
    }

    // Verify the code
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code: verificationCode
    });

    if (verifyError) {
      console.error('MFA verification failed:', verifyError.message);
      return;
    }

    alert('MFA setup completed successfully!');
    setQrCode(null);
    setSecret(null);
    setFactorId(null);
    setVerificationCode('');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Multi-Factor Authentication</h2>
      
      {!qrCode ? (
        <button
          onClick={enrollMFA}
          disabled={isEnrolling}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isEnrolling ? 'Setting up...' : 'Enable MFA'}
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Scan QR Code with your authenticator app:</h3>
            <img src={qrCode} alt="MFA QR Code" className="mt-2" />
          </div>
          
          <div>
            <h3 className="font-medium">Or enter this secret manually:</h3>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">{secret}</code>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter verification code from your app:
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="123456"
              className="border border-gray-300 rounded px-3 py-2 w-32"
              maxLength={6}
            />
          </div>
          
          <button
            onClick={verifyMFA}
            disabled={verificationCode.length !== 6}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Verify & Complete Setup
          </button>
        </div>
      )}
    </div>
  );
}
```

### MFA Login Flow

```typescript
// Login with MFA verification
export async function loginWithMFA(email: string, password: string, mfaCode?: string) {
  const supabase = createClient();
  
  // Step 1: Attempt regular login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error && error.message.includes('MFA challenge required')) {
    // Step 2: Handle MFA challenge
    if (!mfaCode) {
      throw new Error('MFA code required');
    }

    // Get user's MFA factors
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const factor = factors?.totp?.[0];

    if (!factor) {
      throw new Error('No MFA factor found');
    }

    // Challenge and verify
    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: factor.id
    });

    if (challengeError) {
      throw challengeError;
    }

    const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
      factorId: factor.id,
      challengeId: challengeData.id,
      code: mfaCode
    });

    if (verifyError) {
      throw verifyError;
    }

    return verifyData;
  }

  if (error) {
    throw error;
  }

  return data;
}
```

## Security Considerations

### MFA Best Practices

1. **Backup Codes**: Always provide backup recovery codes
2. **Factor Management**: Allow users to manage multiple factors
3. **Graceful Degradation**: Handle MFA failures gracefully
4. **Admin Override**: Provide admin tools to reset MFA for users
5. **Audit Logging**: Log all MFA enrollment and verification events

### Rate Limiting

Implement rate limiting for MFA attempts:

```typescript
// Example rate limiting pattern
const MFA_ATTEMPT_LIMIT = 5;
const MFA_LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export function rateLimitMFAAttempts(userId: string) {
  // Implementation depends on your caching/storage solution
  // Track failed attempts per user
  // Lock out after too many failures
}
```

## Enterprise Integration

### Single Sign-On (SSO) with MFA

```typescript
// SSO providers can be configured to require MFA
const { data, error } = await supabase.auth.signInWithSSO({
  domain: 'company.com',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    // MFA requirements handled by SSO provider
  }
});
```

### Conditional MFA

```typescript
// Require MFA only for sensitive operations
export function requireMFAForSensitiveAction(user: User) {
  // Check user role, action type, etc.
  const sensitiveRoles = ['admin', 'billing'];
  const requiresMFA = sensitiveRoles.includes(user.role);
  
  return requiresMFA;
}
```

## Testing MFA

### Mock MFA for Development

```typescript
// Mock MFA service for testing
export class MockMFAService {
  async enroll() {
    return {
      data: {
        id: 'mock-factor-id',
        qr_code: 'data:image/png;base64,mock-qr-code',
        secret: 'MOCK-SECRET-KEY',
        uri: 'otpauth://totp/test@example.com?secret=MOCK-SECRET-KEY'
      },
      error: null
    };
  }

  async verify(code: string) {
    // Accept specific test codes
    const validTestCodes = ['123456', '000000'];
    
    if (validTestCodes.includes(code)) {
      return { data: { access_token: 'mock-token' }, error: null };
    }
    
    return { data: null, error: { message: 'Invalid code' } };
  }
}
```

This reference guide provides comprehensive MFA patterns for applications that require enhanced security beyond basic authentication.