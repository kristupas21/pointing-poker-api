import ValidationService from '@services/validationService';
import { ValidationErrorObject, ValidationSchema } from '@services/validationService/types';
import {
  ARRAY_LENGTH_MAX,
  ARRAY_LENGTH_MIN,
  ARRAY_OBJECT,
  ARRAY_PRIMITIVE,
  BOOLEAN,
  NUMBER,
  NUMBER_MAX,
  NUMBER_MIN,
  OBJECT,
  REQUIRED,
  STRING,
  STRING_LENGTH_MAX,
  STRING_LENGTH_MIN,
  STRING_NUMBER,
  STRING_NUMBER_MAX,
  STRING_NUMBER_MIN
} from '@services/validationService/validatorKeys';
import ErrorService from '@services/errorService';
import StatusCodes from 'http-status-codes';
import { ERROR_CODES } from '@shared-with-ui/constants';

const errorService = new ErrorService();

const getError = (errorObj: ValidationErrorObject<any>) =>
  errorService.generate(StatusCodes.BAD_REQUEST, ERROR_CODES.INVALID_PARAMS, errorObj);

type MockNested = {
  id: string;
  irrelevant?: any;
}

type MockObject = {
  str: string;
  num: number;
  nestedObj: MockNested,
  objArray: MockNested[],
  primitiveArray: boolean[],
  bool: boolean;
  stringNum: string;
  withExceptions: string | number;
  irrelevant?: any;
}

const MockNestedSchema: ValidationSchema<MockNested> = {
  id: [
    { key: REQUIRED },
    { key: STRING },
  ]
};

const MockSchema: ValidationSchema<MockObject> = {
  str: [
    { key: REQUIRED },
    { key: STRING },
    { key: STRING_LENGTH_MIN, args: [2] },
    { key: STRING_LENGTH_MAX, args: [8] },
  ],
  num: [
    { key: NUMBER },
    { key: NUMBER_MIN, args: [2] },
    { key: NUMBER_MAX, args: [10] },
  ],
  bool: [
    { key: BOOLEAN },
  ],
  nestedObj: [
    { key: OBJECT, schema: MockNestedSchema },
  ],
  objArray: [
    { key: ARRAY_OBJECT, schema: MockNestedSchema },
  ],
  primitiveArray: [
    { key: ARRAY_PRIMITIVE, validators: [{ key: BOOLEAN }]},
    { key: ARRAY_LENGTH_MIN, args: [2]},
    { key: ARRAY_LENGTH_MAX, args: [3]},
  ],
  stringNum: [
    { key: STRING_NUMBER },
    { key: STRING_NUMBER_MIN, args: [2] },
    { key: STRING_NUMBER_MAX, args: [100] },
  ],
  withExceptions: [
    { key: STRING, exceptions: [1000] }
  ],
};

describe('validationService', () => {
  const validationService = new ValidationService();

  const validSchema: MockObject = {
    str: 'str',
    num: 5,
    bool: false,
    nestedObj: {
      id: 'id',
      irrelevant: Infinity,
    },
    objArray: [
      { id: 'id' }, { id: 'id-1' },
    ],
    primitiveArray: [true, false],
    stringNum: '15',
    withExceptions: 'string',
  };

  it('does not throw if schema is valid', () => {
    expect(
      validationService.validateBySchema(validSchema, MockSchema)
    ).toEqual(undefined);
  });

  it(`throws ${REQUIRED} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      str: undefined,
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ str: { type: REQUIRED, value: undefined } }));
    }
  });

  it(`throws ${STRING} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      str: 19 as unknown as string,
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ str: { type: STRING, value: 19 } }));
    }
  });

  it(`throws ${STRING_LENGTH_MIN} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      str: 'A',
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ str: { type: STRING_LENGTH_MIN, value: 'A', shouldMatch: [2] } }));
    }
  });

  it(`throws ${STRING_LENGTH_MAX} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      str: 'Atonement',
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({
        str: { type: STRING_LENGTH_MAX, value: 'Atonement', shouldMatch: [8] }
      }));
    }
  });

  it(`throws ${NUMBER} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      num: NaN,
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ num: { type: NUMBER, value: NaN } }));
    }
  });

  it(`throws ${NUMBER_MAX} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      num: 5000,
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ num: { type: NUMBER_MAX, value: 5000, shouldMatch: [10] } }));
    }
  });

  it(`throws ${NUMBER_MIN} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      num: 1,
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ num: { type: NUMBER_MIN, value: 1, shouldMatch: [2] } }));
    }
  });

  it('throws bool exception', () => {
    const payload: MockObject = {
      ...validSchema,
      bool: 'false' as unknown as boolean
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ bool: { type: BOOLEAN, value: 'false' } }));
    }
  });

  it(`throws ${OBJECT} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      nestedObj: 'string' as unknown as MockNested,
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ nestedObj: { type: OBJECT, value: 'string' } }));
    }
  });

  it(`throws ${ARRAY_OBJECT} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      objArray: {} as unknown as any[],
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ objArray: { type: ARRAY_OBJECT, value: {} } }));
    }
  });

  it(`throws ${ARRAY_PRIMITIVE} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      primitiveArray: [{} as unknown as boolean]
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ primitiveArray: { type: ARRAY_PRIMITIVE, value: [{}] } }));
    }
  });

  it(`throws ${ARRAY_LENGTH_MIN} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      primitiveArray: [false],
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({
        primitiveArray: { type: ARRAY_LENGTH_MIN, value: [false], shouldMatch: [2] }
      }));
    }
  });

  it(`throws ${ARRAY_LENGTH_MAX} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      primitiveArray: [false, false, false, false],
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({
        primitiveArray: { type: ARRAY_LENGTH_MAX, value: [false, false, false, false], shouldMatch: [3] }
      }));
    }
  });

  it(`throws ${STRING_NUMBER} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      stringNum: 'xx',
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({ stringNum: { type: STRING_NUMBER, value: 'xx' } }));
    }
  });

  it(`throws ${STRING_NUMBER_MIN} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      stringNum: '0'
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({
        stringNum: { type: STRING_NUMBER_MIN, value: '0', shouldMatch: [2] }
      }));
    }
  });

  it(`throws ${STRING_NUMBER_MAX} exception`, () => {
    const payload: MockObject = {
      ...validSchema,
      stringNum: '102'
    };

    try {
      validationService.validateBySchema(payload, MockSchema);
    } catch (e) {
      expect(e).toEqual(getError({
        stringNum: { type: STRING_NUMBER_MAX, value: '102', shouldMatch: [100] }
      }));
    }
  });

  it('does not throw if type is wrong but value added to exceptions', () => {
    const payload: MockObject = {
      ...validSchema,
      withExceptions: 1000,
    };

    expect(
      validationService.validateBySchema(payload, MockSchema)
    ).toEqual(undefined);
  });
});
