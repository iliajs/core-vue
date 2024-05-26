import type { ICredentialType } from "@/modules/credentials/types/entities";
import { CredentialDatabase } from "@/modules/credentials/classes/CredentialDatabase";
import { useCredentialStore } from "@/modules/credentials/store/credentialStore";
import { v4 as uuidv4 } from "uuid";

type SearchObject = Record<
  string,
  string | number | boolean | undefined | null
>;

export class CredentialType {
  public static get(searchObject?: SearchObject): ICredentialType[] {
    let items = useCredentialStore().credentialDatabase.credentialTypes;
    if (searchObject) {
      Object.entries(searchObject).forEach(([key, value]) => {
        items = items.filter(
          (item) => item[key as keyof ICredentialType] === value
        );
      });
    }
    return items;
  }

  public static async add(item: Omit<ICredentialType, "name">): Promise<void> {
    useCredentialStore().credentialDatabase.credentialTypes.push({
      name: uuidv4(),
      ...item,
    });

    await this.save();
  }

  public static async save(): Promise<void> {
    await CredentialDatabase.save();
  }
}