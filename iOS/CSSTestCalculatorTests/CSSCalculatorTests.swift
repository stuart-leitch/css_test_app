import XCTest
@testable import CSSTestCalculator

final class CSSCalculatorTests: XCTestCase {
    
    // MARK: - parseTimeInput Tests - Valid Inputs
    
    func testParseTimeInput_ColonFormat() {
        XCTAssertEqual(CSSCalculator.parseTimeInput("3:28"), 208)
        XCTAssertEqual(CSSCalculator.parseTimeInput("7:20"), 440)
        XCTAssertEqual(CSSCalculator.parseTimeInput("1:40"), 100)
    }
    
    func testParseTimeInput_ColonFormatWithDecimalSeconds() {
        XCTAssertEqual(CSSCalculator.parseTimeInput("3:28.5"), 208.5)
        XCTAssertEqual(CSSCalculator.parseTimeInput("7:20.3"), 440.3)
    }
    
    func testParseTimeInput_SpaceFormat() {
        XCTAssertEqual(CSSCalculator.parseTimeInput("3 28"), 208)
        XCTAssertEqual(CSSCalculator.parseTimeInput("7 20"), 440)
    }
    
    func testParseTimeInput_PeriodFormatAsMinSec() {
        // Format X.YY where X <= 12 and YY < 60 is treated as MM.SS
        XCTAssertEqual(CSSCalculator.parseTimeInput("3.28"), 208)
        XCTAssertEqual(CSSCalculator.parseTimeInput("7.20"), 440)
        XCTAssertEqual(CSSCalculator.parseTimeInput("12.30"), 750)
    }
    
    func testParseTimeInput_PeriodFormatAsDecimalSeconds() {
        // Large values treated as decimal seconds
        XCTAssertEqual(CSSCalculator.parseTimeInput("208.5"), 208.5)
        XCTAssertEqual(CSSCalculator.parseTimeInput("440.3"), 440.3)
    }
    
    func testParseTimeInput_PlainSeconds() {
        XCTAssertEqual(CSSCalculator.parseTimeInput("208"), 208)
        XCTAssertEqual(CSSCalculator.parseTimeInput("440"), 440)
    }
    
    func testParseTimeInput_WithWhitespace() {
        XCTAssertEqual(CSSCalculator.parseTimeInput("  3:28  "), 208)
        XCTAssertEqual(CSSCalculator.parseTimeInput(" 208 "), 208)
    }
    
    // MARK: - parseTimeInput Tests - Invalid Inputs
    
    func testParseTimeInput_EmptyString() {
        XCTAssertNil(CSSCalculator.parseTimeInput(""))
        XCTAssertNil(CSSCalculator.parseTimeInput("   "))
    }
    
    func testParseTimeInput_InvalidFormat() {
        XCTAssertNil(CSSCalculator.parseTimeInput("abc"))
        XCTAssertNil(CSSCalculator.parseTimeInput("3:"))
        XCTAssertNil(CSSCalculator.parseTimeInput(":28"))
    }
    
    func testParseTimeInput_SecondsOver60InColonFormat() {
        XCTAssertNil(CSSCalculator.parseTimeInput("3:61"))
        XCTAssertNil(CSSCalculator.parseTimeInput("3:99"))
    }
    
    func testParseTimeInput_SecondsOver60InPeriodFormat() {
        // 3.61 with minutes <= 12 and seconds >= 60 should be nil
        XCTAssertNil(CSSCalculator.parseTimeInput("3.61"))
    }
    
    func testParseTimeInput_NegativeValues() {
        XCTAssertNil(CSSCalculator.parseTimeInput("-1"))
        XCTAssertNil(CSSCalculator.parseTimeInput("-3:28"))
    }
    
    func testParseTimeInput_Zero() {
        XCTAssertNil(CSSCalculator.parseTimeInput("0"))
        XCTAssertNil(CSSCalculator.parseTimeInput("0:00"))
    }
    
    // MARK: - validateTimeInput Tests
    
    func testValidateTimeInput_200mValid() {
        XCTAssertNil(CSSCalculator.validateTimeInput("3:28", distance: 200))
        XCTAssertNil(CSSCalculator.validateTimeInput("1:40", distance: 200))
        XCTAssertNil(CSSCalculator.validateTimeInput("6:00", distance: 200))
    }
    
    func testValidateTimeInput_200mTooFast() {
        let error = CSSCalculator.validateTimeInput("1:30", distance: 200)
        XCTAssertEqual(error, .time200TooFast)
    }
    
    func testValidateTimeInput_200mTooSlow() {
        let error = CSSCalculator.validateTimeInput("7:00", distance: 200)
        XCTAssertEqual(error, .time200TooSlow)
    }
    
    func testValidateTimeInput_400mValid() {
        XCTAssertNil(CSSCalculator.validateTimeInput("7:20", distance: 400))
        XCTAssertNil(CSSCalculator.validateTimeInput("3:30", distance: 400))
        XCTAssertNil(CSSCalculator.validateTimeInput("12:00", distance: 400))
    }
    
    func testValidateTimeInput_400mTooFast() {
        let error = CSSCalculator.validateTimeInput("3:00", distance: 400)
        XCTAssertEqual(error, .time400TooFast)
    }
    
    func testValidateTimeInput_400mTooSlow() {
        let error = CSSCalculator.validateTimeInput("13:00", distance: 400)
        XCTAssertEqual(error, .time400TooSlow)
    }
    
    func testValidateTimeInput_InvalidFormat() {
        let error = CSSCalculator.validateTimeInput("abc", distance: 200)
        XCTAssertEqual(error, .invalidInput)
    }
    
    func testValidateTimeInput_SecondsOver60() {
        let error = CSSCalculator.validateTimeInput("3:65", distance: 200)
        XCTAssertEqual(error, .secondsMustBeLessThan60)
    }
    
    func testValidateTimeInput_EmptyIsValid() {
        // Empty input returns nil (not an error, just incomplete)
        XCTAssertNil(CSSCalculator.validateTimeInput("", distance: 200))
    }
    
    // MARK: - formatTime Tests
    
    func testFormatTime_Basic() {
        XCTAssertEqual(CSSCalculator.formatTime(208), "3:28")
        XCTAssertEqual(CSSCalculator.formatTime(440), "7:20")
        XCTAssertEqual(CSSCalculator.formatTime(60), "1:00")
        XCTAssertEqual(CSSCalculator.formatTime(90), "1:30")
    }
    
    func testFormatTime_WithDecimals() {
        XCTAssertEqual(CSSCalculator.formatTime(208.5, includeDecimals: true), "3:28.5")
        XCTAssertEqual(CSSCalculator.formatTime(440.3, includeDecimals: true), "7:20.3")
    }
    
    func testFormatTime_WithDecimalsButWholeNumber() {
        XCTAssertEqual(CSSCalculator.formatTime(208, includeDecimals: true), "3:28")
    }
    
    func testFormatTime_ZeroMinutes() {
        XCTAssertEqual(CSSCalculator.formatTime(45), "0:45")
    }
    
    func testFormatTime_NaN() {
        XCTAssertEqual(CSSCalculator.formatTime(.nan), "-")
    }
    
    // MARK: - calculateCSS Tests
    
    func testCalculateCSS_ValidInput() throws {
        let result = try CSSCalculator.calculateCSS(time200: 208, time400: 440)
        XCTAssertEqual(result.css, 116)
        XCTAssertEqual(result.pace200, 104)
        XCTAssertEqual(result.pace400, 110)
    }
    
    func testCalculateCSS_WithDecimalTimes() throws {
        let result = try CSSCalculator.calculateCSS(time200: 208.5, time400: 440.5)
        XCTAssertEqual(result.css, 116)
        XCTAssertEqual(result.pace200, 104.25)
        XCTAssertEqual(result.pace400, 110.125)
    }
    
    func testCalculateCSS_Time200TooFast() {
        XCTAssertThrowsError(try CSSCalculator.calculateCSS(time200: 90, time400: 440)) { error in
            XCTAssertEqual(error as? CSSError, .time200TooFast)
        }
    }
    
    func testCalculateCSS_Time200TooSlow() {
        XCTAssertThrowsError(try CSSCalculator.calculateCSS(time200: 400, time400: 440)) { error in
            XCTAssertEqual(error as? CSSError, .time200TooSlow)
        }
    }
    
    func testCalculateCSS_Time400TooFast() {
        XCTAssertThrowsError(try CSSCalculator.calculateCSS(time200: 208, time400: 200)) { error in
            XCTAssertEqual(error as? CSSError, .time400TooFast)
        }
    }
    
    func testCalculateCSS_Time400TooSlow() {
        XCTAssertThrowsError(try CSSCalculator.calculateCSS(time200: 208, time400: 800)) { error in
            XCTAssertEqual(error as? CSSError, .time400TooSlow)
        }
    }
    
    func testCalculateCSS_Time400NotGreaterThan200() {
        XCTAssertThrowsError(try CSSCalculator.calculateCSS(time200: 300, time400: 300)) { error in
            XCTAssertEqual(error as? CSSError, .time400MustBeGreater)
        }
    }
    
    func testCalculateCSS_Pace400FasterThan200() {
        // 200m in 3:00 = 90s/100m pace
        // 400m in 5:36 = 336s = 84s/100m pace (faster, which is invalid)
        // Wait - this would fail the min/max check first
        // Let's use valid range values that still produce invalid paces
        // 200m = 2:20 (140s) = 70s/100m pace
        // 400m = 4:40 (280s) = 70s/100m pace
        // Need 400m pace < 200m pace
        // 200m = 3:00 (180s) = 90s/100m
        // 400m = 5:00 (300s) = 75s/100m (faster)
        XCTAssertThrowsError(try CSSCalculator.calculateCSS(time200: 180, time400: 300)) { error in
            XCTAssertEqual(error as? CSSError, .pace400CannotBeFaster)
        }
    }
    
    func testCalculateCSS_NegativeValues() {
        XCTAssertThrowsError(try CSSCalculator.calculateCSS(time200: -1, time400: 440)) { error in
            XCTAssertEqual(error as? CSSError, .timesMustBePositive)
        }
    }
    
    // MARK: - Constants Tests
    
    func testConstants_200mLimits() {
        XCTAssertEqual(CSSConstants.time200.min, 100)
        XCTAssertEqual(CSSConstants.time200.max, 360)
    }
    
    func testConstants_400mLimits() {
        XCTAssertEqual(CSSConstants.time400.min, 210)
        XCTAssertEqual(CSSConstants.time400.max, 720)
    }
}
