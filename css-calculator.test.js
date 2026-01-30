const { parseTimeInput, formatTime, calculateCSS } = require('./css-calculator');

describe('parseTimeInput - valid inputs', () => {
    describe('MM:SS format', () => {
        test('parses 1:46 as 106 seconds', () => {
            expect(parseTimeInput('1:46')).toBe(106);
        });

        test('parses 3:28 as 208 seconds', () => {
            expect(parseTimeInput('3:28')).toBe(208);
        });

        test('parses 7:20 as 440 seconds', () => {
            expect(parseTimeInput('7:20')).toBe(440);
        });

        test('parses 0:45 as 45 seconds', () => {
            expect(parseTimeInput('0:45')).toBe(45);
        });

        test('parses 10:00 as 600 seconds', () => {
            expect(parseTimeInput('10:00')).toBe(600);
        });

        test('handles leading/trailing whitespace', () => {
            expect(parseTimeInput('  1:46  ')).toBe(106);
        });
    });

    describe('MM:SS.s format (decimal seconds)', () => {
        test('parses 1:46.5 as 106.5 seconds', () => {
            expect(parseTimeInput('1:46.5')).toBe(106.5);
        });

        test('parses 3:28.25 as 208.25 seconds', () => {
            expect(parseTimeInput('3:28.25')).toBe(208.25);
        });

        test('parses 0:45.1 as 45.1 seconds', () => {
            expect(parseTimeInput('0:45.1')).toBe(45.1);
        });

        test('parses 3:28.9 as 208.9 seconds', () => {
            expect(parseTimeInput('3:28.9')).toBe(208.9);
        });

        test('parses 7:20.05 as 440.05 seconds', () => {
            expect(parseTimeInput('7:20.05')).toBe(440.05);
        });
    });

    describe('MM.SS format (period separator)', () => {
        test('parses 3.28 as 208 seconds', () => {
            expect(parseTimeInput('3.28')).toBe(208);
        });

        test('parses 7.20 as 440 seconds', () => {
            expect(parseTimeInput('7.20')).toBe(440);
        });

        test('parses 1.05 as 65 seconds', () => {
            expect(parseTimeInput('1.05')).toBe(65);
        });

        test('parses 0.30 as 30 seconds', () => {
            expect(parseTimeInput('0.30')).toBe(30);
        });

        test('parses 10.00 as 600 seconds', () => {
            expect(parseTimeInput('10.00')).toBe(600);
        });
    });

    describe('MM SS format (space separator)', () => {
        test('parses 3 28 as 208 seconds', () => {
            expect(parseTimeInput('3 28')).toBe(208);
        });

        test('parses 7 20 as 440 seconds', () => {
            expect(parseTimeInput('7 20')).toBe(440);
        });

        test('parses 1 05 as 65 seconds', () => {
            expect(parseTimeInput('1 05')).toBe(65);
        });

        test('parses 0 45 as 45 seconds', () => {
            expect(parseTimeInput('0 45')).toBe(45);
        });

        test('handles multiple spaces', () => {
            expect(parseTimeInput('3  28')).toBe(208);
        });

        test('parses decimal seconds with space separator', () => {
            expect(parseTimeInput('3 28.5')).toBe(208.5);
        });
    });

    describe('seconds format (integer)', () => {
        test('parses 106 as 106 seconds', () => {
            expect(parseTimeInput('106')).toBe(106);
        });

        test('parses 208 as 208 seconds', () => {
            expect(parseTimeInput('208')).toBe(208);
        });

        test('parses 240 as 240 seconds', () => {
            expect(parseTimeInput('240')).toBe(240);
        });

        test('parses 440 as 440 seconds', () => {
            expect(parseTimeInput('440')).toBe(440);
        });

        test('parses 500 as 500 seconds', () => {
            expect(parseTimeInput('500')).toBe(500);
        });

        test('handles leading/trailing whitespace', () => {
            expect(parseTimeInput('  208  ')).toBe(208);
        });
    });

    describe('seconds format (decimal)', () => {
        test('parses 208.5 as 208.5 seconds', () => {
            expect(parseTimeInput('208.5')).toBe(208.5);
        });

        test('parses 440.25 as 440.25 seconds', () => {
            expect(parseTimeInput('440.25')).toBe(440.25);
        });

        test('parses 106.9 as 106.9 seconds', () => {
            expect(parseTimeInput('106.9')).toBe(106.9);
        });

        test('parses 500.1 as 500.1 seconds', () => {
            expect(parseTimeInput('500.1')).toBe(500.1);
        });

        test('handles leading/trailing whitespace', () => {
            expect(parseTimeInput('  208  ')).toBe(208);
        });
    });
});

describe('parseTimeInput - invalid inputs', () => {
    describe('empty and non-numeric', () => {
        test('returns null for empty string', () => {
            expect(parseTimeInput('')).toBe(null);
        });

        test('returns null for non-numeric input', () => {
            expect(parseTimeInput('abc')).toBe(null);
        });

        test('returns null for zero', () => {
            expect(parseTimeInput('0')).toBe(null);
        });

        test('returns null for negative numbers', () => {
            expect(parseTimeInput('-100')).toBe(null);
        });
    });

    describe('invalid seconds (>= 60)', () => {
        test('rejects MM:SS with seconds >= 60', () => {
            expect(parseTimeInput('1:60')).toBe(null);
            expect(parseTimeInput('1:65')).toBe(null);
        });

        test('rejects MM.SS with seconds >= 60', () => {
            expect(parseTimeInput('1.60')).toBe(null);
            expect(parseTimeInput('1.75')).toBe(null);
        });

        test('rejects MM SS with seconds >= 60', () => {
            expect(parseTimeInput('1 60')).toBe(null);
            expect(parseTimeInput('1 65')).toBe(null);
        });
    });
});

describe('formatTime', () => {
    test('formats 106 seconds as 1:46', () => {
        expect(formatTime(106)).toBe('1:46');
    });

    test('formats 130 seconds as 2:10', () => {
        expect(formatTime(130)).toBe('2:10');
    });

    test('formats 60 seconds as 1:00', () => {
        expect(formatTime(60)).toBe('1:00');
    });

    test('formats 5 seconds as 0:05', () => {
        expect(formatTime(5)).toBe('0:05');
    });

    test('returns - for null', () => {
        expect(formatTime(null)).toBe('-');
    });

    test('returns - for NaN', () => {
        expect(formatTime(NaN)).toBe('-');
    });

    describe('with includeDecimals option', () => {
        test('formats 106.5 seconds as 1:46.5 when includeDecimals=true', () => {
            expect(formatTime(106.5, true)).toBe('1:46.5');
        });

        test('formats 130.25 seconds as 2:10.3 when includeDecimals=true', () => {
            expect(formatTime(130.25, true)).toBe('2:10.3');
        });

        test('formats whole seconds without decimal when includeDecimals=true', () => {
            expect(formatTime(106, true)).toBe('1:46');
        });

        test('rounds decimal to 1 place when includeDecimals=true', () => {
            expect(formatTime(106.789, true)).toBe('1:46.8');
        });
    });
});

describe('calculateCSS', () => {
    describe('valid calculations', () => {
        test('calculates CSS correctly for 200m=240s, 400m=500s -> CSS=2:10 (130s)', () => {
            const result = calculateCSS(240, 500);
            expect(result.css).toBe(130);
        });

        test('calculates 200m pace correctly (time/2)', () => {
            const result = calculateCSS(240, 500);
            expect(result.pace200).toBe(120); // 240/2
        });

        test('calculates 400m pace correctly (time/4)', () => {
            const result = calculateCSS(240, 500);
            expect(result.pace400).toBe(125); // 500/4
        });

        test('another example: 200m=208s (3:28), 400m=440s (7:20)', () => {
            const result = calculateCSS(208, 440);
            expect(result.css).toBe(116); // (440-208)/2
            expect(result.pace200).toBe(104); // 208/2 = 1:44
            expect(result.pace400).toBe(110); // 440/4 = 1:50
        });
    });

    describe('validation errors', () => {
        test('throws error if 200m time is zero or negative', () => {
            expect(() => calculateCSS(0, 500)).toThrow('Times must be positive values');
            expect(() => calculateCSS(-100, 500)).toThrow('Times must be positive values');
        });

        test('throws error if 400m time is zero or negative', () => {
            expect(() => calculateCSS(240, 0)).toThrow('Times must be positive values');
            expect(() => calculateCSS(240, -100)).toThrow('Times must be positive values');
        });

        test('throws error if 400m time is less than 200m time', () => {
            expect(() => calculateCSS(300, 250)).toThrow('400m time must be greater than 200m time');
        });

        test('throws error if 400m time equals 200m time', () => {
            expect(() => calculateCSS(240, 240)).toThrow('400m time must be greater than 200m time');
        });

        test('throws error if 200m time is less than 100 seconds', () => {
            expect(() => calculateCSS(99, 440)).toThrow('200m time must be at least 100 seconds');
        });

        test('throws error if 400m time is less than 210 seconds', () => {
            expect(() => calculateCSS(120, 209)).toThrow('400m time must be at least 210 seconds');
        });

        test('throws error if 200m time is more than 6 minutes', () => {
            expect(() => calculateCSS(361, 500)).toThrow('200m time must be less than 6 minutes');
        });

        test('throws error if 400m time is more than 12 minutes', () => {
            expect(() => calculateCSS(200, 721)).toThrow('400m time must be less than 12 minutes');
        });

        test('throws error if 400m pace is faster than 200m pace', () => {
            // 200m in 240s = 120s per 100m
            // 400m in 400s = 100s per 100m (faster pace - invalid!)
            expect(() => calculateCSS(240, 400)).toThrow('400m pace cannot be faster than 200m pace');
        });
    });
});
