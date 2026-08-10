import { useAuth, useSignIn, useSignUp } from '../shared/clerk';
import { Redirect, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, ErrorNotice, Input, Money, Plate, Text, useDesignTokens, useThemedStyles, type DesignTokens, type SemanticColors } from '../shared/design-system';
import { useCartStore } from '../store/cart-store';

type AuthStep = 'sign_in' | 'sign_up' | 'verify_email' | 'forgot_password' | 'reset_password';

function clerkMessage(error: unknown): string {
  const candidate = error as { errors?: Array<{ longMessage?: string; message?: string }> };
  return candidate.errors?.[0]?.longMessage
    ?? candidate.errors?.[0]?.message
    ?? (error instanceof Error ? error.message : 'Something went wrong. Please try again.');
}

function safeReturnTo(value: string | string[] | undefined): string {
  const route = Array.isArray(value) ? value[0] : value;
  return route?.startsWith('/') && !route.startsWith('//') ? route : '/';
}

function createStyles(c: SemanticColors, tokens: DesignTokens) {
  return {
    safe: { flex: 1, backgroundColor: c.canvas },
    keyboard: { flex: 1 },
    content: { flexGrow: 1, justifyContent: 'center' as const, padding: 18, gap: 20 },
    eyebrow: { alignSelf: 'flex-start' as const, borderRadius: 3, borderWidth: 2, borderColor: c.stroke, backgroundColor: c.ink, paddingHorizontal: 9, paddingVertical: 5 },
    heading: { gap: 6 },
    form: { gap: 12, padding: 16, borderWidth: 2, borderColor: c.stroke, borderRadius: 0, backgroundColor: c.surface },
    switchRow: { flexDirection: 'row' as const, justifyContent: 'center' as const, gap: 6, paddingVertical: 6 },
    link: { paddingVertical: 8 },
  };
}

export default function AuthScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useDesignTokens();
  const cart = useCartStore();
  const router = useRouter();
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const destination = useMemo(() => safeReturnTo(params.returnTo), [params.returnTo]);
  const { isLoaded: authLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });
  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp();
  const [step, setStep] = useState<AuthStep>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const complete = async (sessionId: string | null) => {
    if (!sessionId) throw new Error('Clerk did not return a session.');
    const activate = step === 'verify_email' ? setSignUpActive : setSignInActive;
    if (!activate) throw new Error('Clerk is still loading. Please try again.');
    await activate({ session: sessionId });
    router.replace(destination as never);
  };

  const submit = async () => {
    if (!signInLoaded || !signUpLoaded) return;
    setBusy(true);
    setError(null);
    try {
      if (step === 'sign_in') {
        const result = await signIn.create({ identifier: email.trim(), password });
        if (result.status !== 'complete') throw new Error('Additional verification is required for this account.');
        await complete(result.createdSessionId);
        return;
      }
      if (step === 'sign_up') {
        const result = await signUp.create({
          emailAddress: email.trim(),
          password,
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
        });
        if (result.status === 'complete') {
          await setSignUpActive({ session: result.createdSessionId });
          router.replace(destination as never);
          return;
        }
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setStep('verify_email');
        return;
      }
      if (step === 'verify_email') {
        const result = await signUp.attemptEmailAddressVerification({ code: code.trim() });
        if (result.status !== 'complete') throw new Error('That code could not complete verification.');
        await setSignUpActive({ session: result.createdSessionId });
        router.replace(destination as never);
        return;
      }
      if (step === 'forgot_password') {
        await signIn.create({ strategy: 'reset_password_email_code', identifier: email.trim() });
        setStep('reset_password');
        return;
      }
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
        password,
      });
      if (result.status !== 'complete') throw new Error('Your password could not be reset.');
      await complete(result.createdSessionId);
    } catch (caught) {
      setError(clerkMessage(caught));
    } finally {
      setBusy(false);
    }
  };

  if (!authLoaded) {
    return <View style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}><ActivityIndicator color={colors.ink} /></View>;
  }
  if (isSignedIn) return <Redirect href={destination as never} />;

  const isRegistration = step === 'sign_up';
  const isCodeStep = step === 'verify_email' || step === 'reset_password';
  const title = step === 'sign_in' ? 'WELCOME BACK'
    : step === 'sign_up' ? 'JOIN MUSE'
      : step === 'verify_email' ? 'CHECK YOUR EMAIL'
        : step === 'forgot_password' ? 'RESET PASSWORD'
          : 'CHOOSE A NEW PASSWORD';
  const bagTotal = Number(cart.getTotalPrice());
  const bagMessage = destination === '/checkout' && cart.items.length
    ? `Your bag is safe — ${cart.items[0].shopName}, ${cart.checkoutDraft.fulfilment}. We will bring you straight back to checkout.`
    : 'Browsing Muse never needs an account.';

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.eyebrow}><Text variant="label" color={colors.onInk}>MUSE ALPHA PREVIEW</Text></View>
          <View style={styles.heading}>
            <Text variant="display">{title}</Text>
            <Text variant="body" color={colors.inkMuted}>{isCodeStep ? `Enter the code sent to ${email}.` : bagMessage}</Text>
            {destination === '/checkout' && cart.items.length ? <Money amount={bagTotal} emphasis="strong" /> : null}
          </View>
          <View style={styles.form}>
            {isRegistration ? (
              <>
                <Input label="First name" value={firstName} onChangeText={setFirstName} autoCapitalize="words" />
                <Input label="Last name" value={lastName} onChangeText={setLastName} autoCapitalize="words" />
              </>
            ) : null}
            {!isCodeStep ? (
              <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
            ) : (
              <Input label="Verification code" value={code} onChangeText={setCode} keyboardType="number-pad" autoComplete="one-time-code" />
            )}
            {step !== 'forgot_password' && step !== 'verify_email' ? (
              <Input label={step === 'reset_password' ? 'New password' : 'Password'} value={password} onChangeText={setPassword} secureTextEntry autoComplete={step === 'reset_password' ? 'new-password' : 'current-password'} />
            ) : null}
            {error ? <ErrorNotice title="We could not continue" impact={error} recovery="Check the details and try again." /> : null}
            <Button onPress={submit} loading={busy} variant="primary">
              {busy ? <ActivityIndicator color={colors.surface} /> : step === 'sign_in' ? 'SIGN IN' : step === 'sign_up' ? 'CREATE ACCOUNT' : step === 'forgot_password' ? 'SEND RESET CODE' : 'CONTINUE'}
            </Button>
            {step === 'sign_in' ? (
              <Pressable style={styles.link} onPress={() => { setError(null); setStep('forgot_password'); }}>
                <Text variant="bodyBold" align="center">Forgot password?</Text>
              </Pressable>
            ) : null}
          </View>
          {step === 'sign_in' || step === 'sign_up' ? (
            <Pressable style={styles.switchRow} onPress={() => { setError(null); setStep(step === 'sign_in' ? 'sign_up' : 'sign_in'); }}>
              <Text variant="body">{step === 'sign_in' ? 'New to Muse?' : 'Already have an account?'}</Text>
              <Text variant="bodyBold">{step === 'sign_in' ? 'Create account' : 'Sign in'}</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.switchRow} onPress={() => { setError(null); setStep('sign_in'); }}>
              <Text variant="bodyBold">Back to sign in</Text>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
