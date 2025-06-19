import { parseXML, FilteredItem } from './parseXmlToJson';

describe('parseXML', () => {
    test('should correctly parse XML and extract all required fields for a single item', async () => {
        const xmlData = `
            <Root>
                <Items>
                    <Item ItemCode="123" UnitQty="10" Quantity="5" bIsWeighted="true" ItemPrice="100.50" UnitOfMeasurePrice="10.05"/>
                </Items>
            </Root>
        `;
        const expectedJson: FilteredItem[] = [{
            ItemCode: "123",
            UnitQty: "10",
            Quantity: "5",
            bIsWeighted: "true",
            ItemPrice: "100.50",
            UnitOfMeasurePrice: "10.05"
        }];

        const json = await parseXML(xmlData);
        expect(json).toEqual(expectedJson);
    });

    test('should correctly parse XML and extract data for multiple items', async () => {
        const xmlData = `
            <Root>
                <Items>
                    <Item ItemCode="111" UnitQty="1" Quantity="2" bIsWeighted="false" ItemPrice="50.00" UnitOfMeasurePrice="25.00"/>
                    <Item ItemCode="222" UnitQty="3" Quantity="1" bIsWeighted="true" ItemPrice="75.25" UnitOfMeasurePrice="25.08"/>
                </Items>
            </Root>
        `;
        const expectedJson: FilteredItem[] = [
            { ItemCode: "111", UnitQty: "1", Quantity: "2", bIsWeighted: "false", ItemPrice: "50.00", UnitOfMeasurePrice: "25.00" },
            { ItemCode: "222", UnitQty: "3", Quantity: "1", bIsWeighted: "true", ItemPrice: "75.25", UnitOfMeasurePrice: "25.08" }
        ];

        const json = await parseXML(xmlData);
        expect(json).toEqual(expectedJson);
    });

    test('should filter out items with missing required fields', async () => {
        const xmlData = `
            <Root>
                <Items>
                    <Item ItemCode="123" UnitQty="10" Quantity="5"/>
                    <Item ItemCode="456" UnitQty="1" Quantity="2" bIsWeighted="false" ItemPrice="50.00" UnitOfMeasurePrice="25.00"/>
                </Items>
            </Root>
        `;
        const expectedJson: FilteredItem[] = [
            { ItemCode: "456", UnitQty: "1", Quantity: "2", bIsWeighted: "false", ItemPrice: "50.00", UnitOfMeasurePrice: "25.00" }
        ];

        const json = await parseXML(xmlData);
        expect(json).toEqual(expectedJson);
    });

    test('should return an empty array for empty XML', async () => {
        const xmlData = `<Root></Root>`;
        const expectedJson: FilteredItem[] = [];
        const json = await parseXML(xmlData);
        expect(json).toEqual(expectedJson);
    });

    test('should return an empty array if Items section is missing', async () => {
        const xmlData = `<Root><SomeOtherTag/></Root>`;
        const expectedJson: FilteredItem[] = [];
        const json = await parseXML(xmlData);
        expect(json).toEqual(expectedJson);
    });

    test('should return an empty array if Item is missing within Items', async () => {
        const xmlData = `
            <Root>
                <Items>
                    <AnotherTag/>
                </Items>
            </Root>
        `;
        const expectedJson: FilteredItem[] = [];
        const json = await parseXML(xmlData);
        expect(json).toEqual(expectedJson);
    });

    test('should resolve with an empty array for items missing required fields but valid XML', async () => {
        const xmlData = `
            <Root>
                <Items>
                    <Item ItemCode="123"/>
                </Items>
            </Root>
        `;
        const expectedJson: FilteredItem[] = [];
        const json = await parseXML(xmlData);
        expect(json).toEqual(expectedJson);
    });
    

    test('should reject with an error for truly malformed XML', async () => {
        const trulyMalformedXmlData = `<Root><Items><Item><`;
        await expect(parseXML(trulyMalformedXmlData)).rejects.toThrow();
    });

    test('should ignore extra fields in XML items', async () => {
        const xmlData = `
            <Root>
                <Items>
                    <Item ItemCode="789" UnitQty="1" Quantity="1" bIsWeighted="false" ItemPrice="10.00" UnitOfMeasurePrice="10.00" ExtraField="abc"/>
                </Items>
            </Root>
        `;
        const expectedJson: FilteredItem[] = [
            { ItemCode: "789", UnitQty: "1", Quantity: "1", bIsWeighted: "false", ItemPrice: "10.00", UnitOfMeasurePrice: "10.00" }
        ];
        const json = await parseXML(xmlData);
        expect(json).toEqual(expectedJson);
    });
});
